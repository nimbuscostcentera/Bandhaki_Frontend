import React, { useEffect, useMemo, useRef } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import { toast } from "react-toastify";
import useFetchGroupWareHouse from "../../store/ShowStore/useFetchGroupWareHouse";
import useAddGroupWareHouse from "../../store/AddStore/useAddGroupWareHouse";
import useEditGroupWareHouse from "../../store/UpdateStore/useEditGroupWareHouse";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useGroupWareHouseDelete from "../../store/DeleteMasterStore/useGroupWareHouseDelete";
function GroupWareHouseTable({ setIsDisable, search }) {
  const [editedData, setEditedData] = useState({
    ID: null,
    DESCRIPTION: "",
    CODE: null,
    CompanyID: null,
    ParentID:null
  });
    const editinputref = useRef(null);
    useEffect(() => {
      setTimeout(() => {
        if (editinputref.current) {
          editinputref.current.focus();
        }
      }, 150);
    }, [editedData.ID]);
      const [originalOrder, setOriginalOrder] = useState([]);
    const { CompanyID } = useFetchAuth();
  // console.log(editedData);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
   const {
     GroupWareHouseSuccess,
   } = useAddGroupWareHouse();
  const { isGroupWareHouseFetchLoading, GroupWareHouseList, fetchGroupWareHouse } =
    useFetchGroupWareHouse();

  const {
    EditGroupWareHouseFunc,
    GroupWareHouseEditError,
    isGroupWareHouseEditLoading,
    GroupWareHouseEditSuccess,
    ClearStateEditGroupWareHouse,
  } = useEditGroupWareHouse();
  const {
    DeleteGroupWareHouse,
    ClearGroupWareHouseDelete,
    GroupWareHouseDeleteErr,
    isGroupWareHouseDeleteLoading,
    GroupWareHouseDeleteMsg,
  } = useGroupWareHouseDelete();
  // Fetch company list when new data is added or item is edited
  useEffect(() => {
    fetchGroupWareHouse({ CompanyID: CompanyID, isTable: true });
    if (originalOrder.length > 0 && GroupWareHouseList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => GroupWareHouseList.find((row) => row.ID === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }
  }, [
    GroupWareHouseEditSuccess,
    GroupWareHouseDeleteMsg,
  ]);


  const handleSearch = (e) => {
    const value = search.toLowerCase().trim(); // trim to ignore whitespace


    const validFields = Col.map((col) => col.fieldname);

    const filtered = GroupWareHouseList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  },[search])
  useEffect(() => {
     let updatedData = GroupWareHouseList.map((item) => ({ ...item }));
     if (originalOrder.length > 0) {
       updatedData = originalOrder
         .map((id) => updatedData.find((row) => row.ID === id))
         .filter(Boolean);
     }
     setFilteredData([...updatedData]);
  }, [GroupWareHouseList, isGroupWareHouseFetchLoading, GroupWareHouseEditSuccess]);

  // Column configuration for the table headers
   const GroupWareHouse = useMemo(() => {
     return GroupWareHouseList.map((item) => ({
       label: `${item?.CODE}`,
       value: item?.ID,
     }));
   }, [GroupWareHouseList]);

  const Col = [
    {
      headername: "Group WareHouse Code",
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
      headername: "Parent Warehouse",
      fieldname: "ParentCode",
      selectionname: "Parent",
      type: "String",
      width: "200px",
      isSelection: true,
      options: GroupWareHouse,
    },
  ];

  // ActionFunc: Used to enable editing for a selected row
  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setIsDisable(true);
    const selectedData = filteredData[tabIndex];
    if (selectedData) {
      setEditedData({
        ID: selectedData.ID,
        DESCRIPTION: selectedData.DESCRIPTION,
        CODE: selectedData.CODE,
        CompanyID: CompanyID,
      });
    }
  };
console.log(editedData);
  // Sorting function for the table
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

  // Handling changes in the form
  const OnChangeHandler = (index, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the changes made to a company
  const SaveChange = () => {
    EditGroupWareHouseFunc({ ...editedData });
  };

  // Handle success or failure of the edit action
  useEffect(() => {
    if (
      GroupWareHouseEditSuccess &&
      !isGroupWareHouseEditLoading &&
      !GroupWareHouseEditError
    ) {
      toast.success("Group WareHouseCenter Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        ID: null,
        DESCRIPTION: "",
        CODE: null,
        CompanyID: null,
      });
      setIsDisable(false);
    } else if (
      GroupWareHouseEditError &&
      !isGroupWareHouseEditLoading &&
      !GroupWareHouseEditSuccess
    ) {
      toast.error(GroupWareHouseEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditGroupWareHouse();
  }, [isGroupWareHouseEditLoading, GroupWareHouseEditSuccess, GroupWareHouseEditError]);

  

    useEffect(() => {
      if (GroupWareHouseDeleteMsg) {
        toast.success(GroupWareHouseDeleteMsg, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (GroupWareHouseDeleteErr) {
        toast.error(GroupWareHouseDeleteErr, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      ClearGroupWareHouseDelete();
    }, [
      GroupWareHouseDeleteErr,
      isGroupWareHouseDeleteLoading,
      GroupWareHouseDeleteMsg,
    ]);

    const handleDelete = (id) => {
      const deleteobj = filteredData[id];
      // console.log(deleteobj);
      if (deleteobj) {
        DeleteGroupWareHouse({ ID: deleteobj.ID, CompanyID: CompanyID });
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
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isGroupWareHouseFetchLoading}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default GroupWareHouseTable;
