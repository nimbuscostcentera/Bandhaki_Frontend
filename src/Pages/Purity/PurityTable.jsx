import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Table from "../../Component/Table";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";

import useAddPurity from "../../store/AddStore/useAddPurity";
import useEditPurity from "../../store/UpdateStore/useEditPurity";
import useFetchPurity from "../../store/ShowStore/useFetchPurity";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function PurityTable({ setIsDisable }) {
  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [editedData, setEditedData] = useState({
    id: null,
    PURITY: null,
  });
 const [originalOrder, setOriginalOrder] = useState([]);
  const { CompanyID } = useFetchAuth();
  const { PurityList, isPurityLoading, fetchPurityMaster } = useFetchPurity();
  const { AddPuritySuccess } = useAddPurity();
  const {
    PurityEditError,
    isPurityEditLoading,
    PurityEditSuccess,
    EditPurityFunc,
    ClearStateEditPurity,
  } = useEditPurity();

  const Col = [
    { headername: "Purity", fieldname: "PURITY", type: "String" },
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" },
  ];

  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true);
    console.log(PurityList[tabindex]?.ID, tabindex);
    
    setEditedData({
      id: PurityList[tabindex]?.ID,
      PURITY: PurityList[tabindex]?.PURITY,
      DESCRIPTION: PurityList[tabindex]?.DESCRIPTION
    });
  };

  const SortingFunc = (header, type) => {
    //console.log(header,type,"sorttable")
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

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };

  const SaveChange = () => {
    //console.log(editedData);
    EditPurityFunc({ ...editedData, CompanyID: CompanyID });
  };

  useEffect(() => {
    fetchPurityMaster({ CompanyID: CompanyID });
     if (originalOrder.length > 0 && PurityList?.length > 0) {
       const sortedData = originalOrder
         .map((id) => PurityList.find((row) => row.ID === id))
         .filter(Boolean);

       setFilteredData(sortedData);
     }
  }, [AddPuritySuccess, CompanyID, PurityEditSuccess]);

  useEffect(() => {
    let updatedData = PurityList.map((item) => ({ ...item }));
    if (originalOrder.length > 0) {
      updatedData = originalOrder
        .map((id) => updatedData.find((row) => row.ID === id))
        .filter(Boolean);
    }
    setFilteredData([...updatedData]);
  }, [PurityList, PurityEditSuccess]);

  useEffect(() => {
    if (isPurityEditLoading && !PurityEditSuccess && !PurityEditError) {
      toast.play("pleaes wait...", { position: "top-right", autoClose: 3000 });
    }
    if (PurityEditSuccess && !isPurityEditLoading && !PurityEditError) {
      toast.success("Purity Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({ id: null, PURITY: null });
      SetParams({ ActionID: null, IsAction: null });
      setIsDisable(false);
    }
    if (PurityEditError && !isPurityEditLoading && !PurityEditSuccess) {
      toast.error(PurityEditError, { position: "top-right", autoClose: 3000 });
    }
    ClearStateEditPurity();
  }, [isPurityEditLoading, PurityEditSuccess, PurityEditError]);

  return (
    <div className="table-box" style={{ height: "50vh" }}>
      <Table
        tab={filteredData || []}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isPurityLoading}
      />
    </div>
  );
}

export default PurityTable;
