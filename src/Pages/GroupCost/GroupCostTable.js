import React, { useEffect, useMemo } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import { toast } from "react-toastify";

import useFetchGroupCost from "../../store/ShowStore/useFetchGroupCost";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import useEditGroupCost from "../../store/UpdateStore/useEditGroupCost";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useGroupCostCenterDelete from "../../store/DeleteMasterStore/useGroupCostCenterDelete";
function GroupCostTable({ setIsDisable, search }) {
  const { CompanyID } = useFetchAuth();
  const [editedData, setEditedData] = useState({
    ID: null,
    Type: null,
    CODE: null,
    CompanyID: null,
  });
  // console.log(editedData);
  const [originalOrder, setOriginalOrder] = useState([]);
  const typeArr = [
    { label: 1, value: "Customer" },
    { label: 2, value: "WholeSeller" },
  ];
  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, []);
  // console.log(editedData);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
  const { GroupCostSuccess } = useAddGroupCost();
  const { isGroupCostLoading, GroupCostList, fetchGroupCost } =
    useFetchGroupCost();
  const {
    DeleteGroupCostCenter,
    ClearGroupCostCenterDelete,
    GroupCostCenterDeleteErr,
    isGroupCostCenterDeleteLoading,
    GroupCostCenterDeleteMsg,
  } = useGroupCostCenterDelete();
  const {
    EditGroupCostFunc,
    GroupCostEditError,
    isGroupCostEditLoading,
    GroupCostEditSuccess,
    ClearStateEditGroupCost,
  } = useEditGroupCost();
  const handleSearch = (e) => {
    const value = search.toLowerCase().trim(); // trim to ignore whitespace

    const validFields = Col.map((col) => col.fieldname);

    const filtered = GroupCostList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );
    let updatedData;
    if (filtered?.length > 0) {
       updatedData = filtered.map((item) => ({
        ...item,
        TypeName: item.Type === 1 ? "Customer" : "WholeSeller",
      }));
      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.ID === id))
          .filter(Boolean);
      }
    }

    setFilteredData(updatedData);
  };

  useEffect(() => {
    handleSearch();
  }, [search]);
  // Fetch company list when new data is added or item is edited
  useEffect(() => {
    fetchGroupCost({ companyId: CompanyID });
    if (originalOrder.length > 0 && GroupCostList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => GroupCostList.find((row) => row.ID === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }
  }, [GroupCostSuccess, GroupCostEditSuccess, GroupCostCenterDeleteMsg]);

  useEffect(() => {
    if (GroupCostList?.length > 0) {
      let updatedData = GroupCostList.map((item) => ({
        ...item,
        TypeName: item.Type === 1 ? "Customer" : "WholeSeller",
      }));
      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.ID === id))
          .filter(Boolean);
      }

      setFilteredData([...updatedData]);
    }
  }, [GroupCostList, isGroupCostLoading, GroupCostEditSuccess]);

  // Column configuration for the table headers
  const Col = [
    {
      headername: "Group CostCenter Code",
      fieldname: "CODE",
      type: "String",
      width: "100px",
    },
    {
      headername: "Type",
      fieldname: "TypeName",
      selectionname: "Type",
      type: "String",
      isSelection: true,
      options: typeList,
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
        Type: selectedData.Type,
        CODE: selectedData.CODE,
        CompanyID: selectedData.CompanyID,
      });
    }
  };

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
    setOriginalOrder(result.map((row) => row.ID)); // Store order
  };

  // Handling changes in the form
  const OnChangeHandler = (index, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the changes made to a company
  const SaveChange = () => {
    EditGroupCostFunc({ ...editedData });
  };

  // Handle success or failure of the edit action
  useEffect(() => {
    if (
      GroupCostEditSuccess &&
      !isGroupCostEditLoading &&
      !GroupCostEditError
    ) {
      toast.success("Group CostCenter Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        ID: null,
        Type: null,
        CODE: null,
        CompanyID: null,
      });
      setIsDisable(false);
    } else if (
      GroupCostEditError &&
      !isGroupCostEditLoading &&
      !GroupCostEditSuccess
    ) {
      toast.error(GroupCostEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditGroupCost();
  }, [isGroupCostEditLoading, GroupCostEditSuccess, GroupCostEditError]);

  useEffect(() => {
    if (GroupCostCenterDeleteMsg) {
      toast.success(GroupCostCenterDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (GroupCostCenterDeleteErr) {
      toast.error(GroupCostCenterDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearGroupCostCenterDelete();
  }, [
    GroupCostCenterDeleteErr,
    isGroupCostCenterDeleteLoading,
    GroupCostCenterDeleteMsg,
  ]);

  const handleDelete = (id) => {
    const deleteobj = filteredData[id];
    // console.log(deleteobj);
    if (deleteobj) {
      DeleteGroupCostCenter({ CompanyID: CompanyID, ID: deleteobj.ID });
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
        // ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        // isEdit={true}
        // EditedData={editedData}
        isLoading={isGroupCostLoading}
        isDelete={true}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default GroupCostTable;
