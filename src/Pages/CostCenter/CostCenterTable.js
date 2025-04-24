import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Component/Table";
import { toast } from "react-toastify";
import useFetchCostCenter from "../../store/ShowStore/useFetchCostCenter";
import useEditCostCenter from "../../store/UpdateStore/useEditCostCenter";
import useFetchGroupCost from "../../store/ShowStore/useFetchGroupCost";
import useAddCostCenter from "../../store/AddStore/useAddCostCenter";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useCostCenterDelete from "../../store/DeleteMasterStore/useCostCenterDelete";
function CostCenterTable({ setIsDisable, search }) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
  const [originalData, setOriginalData] = useState(null);
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    DESCRIPTION: "",
    TypeSelete: null,
    ParentCode: null,
    CompanyID: null,
  });
  const [originalOrder, setOriginalOrder] = useState([]);
  //-----------------------------------API------------------------------------
  const { isGroupCostLoading, GroupCostList, fetchGroupCost } =
    useFetchGroupCost();
  const {
    isCostCenterLoading,
    CostCenterList,
    fetchCostCenter,
    isCostCenterSuccess,
  } = useFetchCostCenter();
  const { CostCenterSuccess } = useAddCostCenter();
  const {
    EditCostCenterFunc,
    CostCenterEditError,
    isCostCenterEditLoading,
    CostCenterEditSuccess,
    ClearStateEditCostCenter,
  } = useEditCostCenter();
  const {
    DeleteCostCenter,
    ClearCostCenterDelete,
    CostCenterDeleteErr,
    isCostCenterDeleteLoading,
    CostCenterDeleteMsg,
    isCostCenterDeleteSuccess,
  } = useCostCenterDelete();
  const { CompanyID } = useFetchAuth();

  //----------------------------------function------------------------------
  // Enable editing for a selected row
  const ActionFunc = (tabIndex) => {
    setParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);
    const selectedData = filteredData[tabIndex];

    if (selectedData) {
      setEditedData({
        ID: selectedData.ID,
        CODE: selectedData.CODE,
        DESCRIPTION: selectedData.DESCRIPTION,
        TypeSelete: selectedData.Type,
        ParentCode: selectedData.ParentCode,
        CompanyID: selectedData.CompanyID,
      });

      setOriginalData(selectedData); // Store the original data for reference
    }
  };
  const handleDelete = (id) => {
    const deleteobj = filteredData[id];
    // console.log(deleteobj);
    if (deleteobj) {
      DeleteCostCenter({ CompanyID: CompanyID, ID: deleteobj.ID });
    }
  };
  // Handling changes in the form
  const OnChangeHandler = (index, e) => {
    const { name, value } = e.target;

    setEditedData((prev) => {
      // When changing TypeSelete, reset ParentCode but restore original value if switching back
      if (name === "TypeSelete") {
        return {
          ...prev,
          TypeSelete: value,
          ParentCode:
            value === originalData?.Type ? originalData?.ParentCode : null,
        };
      }

      return { ...prev, [name]: value };
    });
  };
  // Save the changes
  const SaveChange = () => {
    const requiredFields = [
      "CODE",
      "DESCRIPTION",
      "ParentCode",
      "ID",
      "CompanyID",
    ];
    const emptyFields = requiredFields.filter((field) => !editedData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Please Fill All The Fields`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    EditCostCenterFunc({ ...editedData });
  };
  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;

    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "Number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID)); // Store order
  };
    const handleSearch = (e) => {
      const value = search.toLowerCase();

      // Extract valid field names from the Col array
      const validFields = Col.map((col) => col.fieldname);

      const filtered = CostCenterList.filter((order) =>
        validFields.some((field) =>
          order[field]?.toString().toLowerCase().includes(value)
        )
      );

      setFilteredData(filtered);
    };
  //-------------------------------------useEffects-----------------------------------
  // Handle success or failure of the edit action
  useEffect(() => {
    handleSearch();
  }, [search]);

  
  useEffect(() => {
    if (
      CostCenterEditSuccess &&
      !isCostCenterEditLoading &&
      !CostCenterEditError
    ) {
      toast.success("Cost Center Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        ID: null,
        CODE: "",
        DESCRIPTION: "",
        TypeSelete: null,
        ParentCode: null,
        CompanyID: null,
      });
      setIsDisable(false);
    } else if (
      CostCenterEditError &&
      !isCostCenterEditLoading &&
      !CostCenterEditSuccess
    ) {
      toast.error(CostCenterEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditCostCenter();
  }, [isCostCenterEditLoading, CostCenterEditSuccess, CostCenterEditError]);
  //set focus
  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.ID]);
  // Fetch cost center data
  useEffect(() => {
    fetchCostCenter({ CompanyID: CompanyID });
  }, [CostCenterEditSuccess, isCostCenterDeleteSuccess, CostCenterSuccess]);

  //set filterdata
  useEffect(() => {
    let updatedData = [];
    if (CostCenterList?.length > 0 && originalOrder?.length == 0) {
      updatedData = CostCenterList?.map((item) => ({
        ...item,
        TypeName: item.Type === 1 ? "Customer" : "WholeSeller",
        TypeSelete: item.Type,
      }));
      setFilteredData([...updatedData]);
    } else if (CostCenterList?.length > 0 && originalOrder?.length > 0) {
      updatedData = originalOrder
        .map((id) => CostCenterList?.find((row) => row.ID === id))
        .filter(Boolean);
      setFilteredData([...updatedData]);
    } else if (!CostCenterList || CostCenterList?.length == 0) {
      setFilteredData([]);
      setOriginalData([]);
      setOriginalOrder([]);
    }
  }, [
    CostCenterList,
    isCostCenterSuccess,
    CostCenterEditSuccess,
    isCostCenterDeleteSuccess,
  ]);

  // Fetch group cost when Type changes
  useEffect(() => {
    if (editedData.TypeSelete !== null) {
      fetchGroupCost({ companyId: CompanyID, type: editedData.TypeSelete });
    }
  }, [editedData.TypeSelete]);

  //toaster of delete
  useEffect(() => {
    if (CostCenterDeleteMsg) {
      toast.success(CostCenterDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (CostCenterDeleteErr) {
      toast.error(CostCenterDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCostCenterDelete();
  }, [CostCenterDeleteErr, isCostCenterDeleteLoading, CostCenterDeleteMsg]);
  //----------------------------------------others variables----------------------------------------
  //type list
  const typeArr = [
    { label: 1, value: "Customer" },
    { label: 2, value: "WholeSeller" },
  ];
  // Convert type array for dropdown
  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, []);
  // Convert GroupCostList for dropdown selection
  const GroupCost = useMemo(() => {
    return GroupCostList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [GroupCostList]);
  // Column configuration for the table headers
  const Col = [
    {
      headername: "Cost Center Code",
      fieldname: "CODE",
      type: "String",
      width: "200px",
      isNotEditable: true,
    },
    {
      headername: "Description",
      fieldname: "DESCRIPTION",
      type: "String",
      width: "200px",
      isUseInputRef: true,
    },
    {
      headername: "Type",
      fieldname: "TypeName",
      selectionname: "TypeSelete",
      type: "String",
      isSelection: true,
      options: typeList,
    },
    {
      headername: "Group CC.",
      fieldname: "GroupCenterCode",
      selectionname: "ParentCode",
      type: "String",
      isSelection: true,
      options: GroupCost,
    },
  ];

  console.log(CostCenterList, filteredData, "check");
  return (
    <div
      className="table-box"
      style={{ height: "55vh", border: "1px solid lightgrey" }}
    >
      <Table
        tab={filteredData || []}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isCostCenterLoading}
        onSorting={SortingFunc}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default CostCenterTable;
