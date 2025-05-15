import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "../../Component/Table";
import { toast } from "react-toastify";
import useFetchWareHouse from "../../store/ShowStore/useFetchWareHouse";
import useAddWareHouse from "../../store/AddStore/useAddWareHouse";
import useFetchGroupWareHouse from "../../store/ShowStore/useFetchGroupWareHouse";
import useEditWareHouse from "../../store/UpdateStore/useEditWareHouse";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import useWarehouseDelete from "../../store/DeleteMasterStore/useWarehouseDelete";
function WareHouseTable({ setIsDisable, search }) {
   const { CompanyID } = useFetchAuth();
  const [originalData, setOriginalData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [params, setParams] = useState({
      ActionID: -1,
      IsAction: false,
    });
 const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({
    ID: null,
    CODE: "",
    DESCRIPTION: "",
    ParentCode: null,
    CompanyID: null,
  });
    const editinputref = useRef(null);
    useEffect(() => {
      setTimeout(() => {
        if (editinputref.current) {
          editinputref.current.focus();
        }
      }, 100);
    }, [editedData.ID]);
  // console.log(editedData);

  const {
    WareHouseSuccess,
  } = useAddWareHouse();
  const { isWareHouseLoading, WareHouseList, fetchWareHouse } =
    useFetchWareHouse();
  const {
    EditWareHouseFunc,
    WareHouseEditError,
    isWareHouseEditLoading,

    WareHouseEditSuccess,
    ClearStateEditWareHouse,
  } = useEditWareHouse();
     const {
       DeleteWarehouse,
       ClearWarehouseDelete,
       WarehouseDeleteErr,
       isWarehouseDeleteLoading,
       WarehouseDeleteMsg,
     } = useWarehouseDelete();
const {
  GroupWareHouseList,
  fetchGroupWareHouse,
  } = useFetchGroupWareHouse();
  

    const handleSearch = (e) => {
      const value = search.toLowerCase().trim(); // trim to ignore whitespace

      const validFields = Col.map((col) => col.fieldname);

      const filtered = WareHouseList.filter((order) =>
        validFields.some((field) =>
          order[field]?.toString().toLowerCase().includes(value)
        )
      );

      setFilteredData(filtered);
    };

    useEffect(() => {
      handleSearch();
    }, [search]);
  // Fetch cost center data
  useEffect(() => {
    fetchWareHouse({ CompanyID: CompanyID });
    if (originalOrder.length > 0 && WareHouseList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => WareHouseList.find((row) => row.ID === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }
  }, [WareHouseEditSuccess, WareHouseSuccess, WarehouseDeleteMsg]);

  // Convert GroupCostList for dropdown selection
  const GroupWareHouse = useMemo(() => {
    return GroupWareHouseList.map((item) => ({
      label: `${item?.CODE}: ${item?.DESCRIPTION}`,
      value: item?.ID,
    }));
  }, [GroupWareHouseList]);

  // Fetch group cost when Type changes
  useEffect(() => {
    if (params.ActionID != -1) {
       fetchGroupWareHouse({ CompanyID: CompanyID });
   }
    
  }, [params.ActionID]);

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;

    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };


  useEffect(() => {
     let updatedData = WareHouseList.map((item) => ({ ...item }));
     if (originalOrder.length > 0) {
       updatedData = originalOrder
         .map((id) => updatedData.find((row) => row.ID === id))
         .filter(Boolean);
     }
     setFilteredData([...updatedData]);
  }, [WareHouseList, isWareHouseLoading, WareHouseEditSuccess]);

  // Column configuration for the table headers
  const Col = [
    {
      headername: "WareHouse Code",
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
      headername: "Group WH.",
      fieldname: "GroupWareHouseCode",
      selectionname: "ParentCode",
      type: "String",
      isSelection: true,
      options: GroupWareHouse,
    },
  ];

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
        ParentCode: selectedData.ParentCode,
        CompanyID: selectedData.CompanyID,
      });

      setOriginalData(selectedData); // Store the original data for reference
    }
  };

  // Handling changes in the form
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

    EditWareHouseFunc({ ...editedData });
  };

  // Handle success or failure of the edit action
  useEffect(() => {
    if (
      WareHouseEditSuccess &&
      !isWareHouseEditLoading &&
      !WareHouseEditError
    ) {
      toast.success("WareHouse Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        ID: null,
        CODE: "",
        DESCRIPTION: "",
        ParentCode: null,
        CompanyID: null,
      });
      setIsDisable(false);
    } else if (
      WareHouseEditError &&
      !isWareHouseEditLoading &&
      !WareHouseEditSuccess
    ) {
      toast.error(WareHouseEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditWareHouse();
  }, [isWareHouseEditLoading, WareHouseEditSuccess, WareHouseEditError]);

 

    useEffect(() => {
      if (WarehouseDeleteMsg) {
        toast.success(WarehouseDeleteMsg, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (WarehouseDeleteErr) {
        toast.error(WarehouseDeleteErr, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      ClearWarehouseDelete();
    }, [
      WarehouseDeleteErr,
      isWarehouseDeleteLoading,
      WarehouseDeleteMsg,
    ]);

    const handleDelete = (id) => {
      const deleteobj = filteredData[id];
      // console.log(deleteobj);
      if (deleteobj) {
        DeleteWarehouse({ CompanyID: CompanyID, ID: deleteobj.ID });
      }
    };

  return (
    <div
      className="table-box"
      style={{ height: "60vh", border: "1px solid lightgrey" }}
    >
      <Table
        tab={filteredData}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isWareHouseLoading}
        onSorting={SortingFunc}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default WareHouseTable;
