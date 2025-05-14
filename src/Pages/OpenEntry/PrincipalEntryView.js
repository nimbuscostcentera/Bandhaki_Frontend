import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import Table from "../../Component/Table";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import "./openentry.css";
import useFetchOpeningPrincipalReport from "../../store/ShowStore/useFetchOpeningPrincipalReport";
import useCheckOpeningPrn from "../../store/Checker/useCheckOpeningPrn";
import useEditOpeningPrincipal from "../../store/UpdateStore/useEditOpeningPrincipal";
import useOpeningPrnDelete from "../../store/DeleteStore/useOpeningPrnDelete";
import DeleteConfirmation from "../../Component/ReusableDelete";
import useOpeningPrincipalDeleteCheck from "../../store/Checker/useOpeningPrincipalDeleteCheck";

function PrincipalEntryView({
  id,
  lotno,
  SRL,
  HandleClose,
  entityType,
  trancode,
  Valuation,    
  headerEntryDate,
}) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [bongView, setBongView] = useState(false);

  const [EditedData, setEditedData] = useState({
    AMOUNT: null,
    ActualWadah: null,
    DetailID: null,
    EntryDate: null,
    ID: -1,
    InterestPercentage: null,
    MODE_OF_PAYMENT: null,
    ReminderWadah: null,
    SRL_PRN: null,
    paymode: 1,
  });
  const [params, setParams] = useState({
    ActionId: -1,
    isAction: false,
    SelectedID: -1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // const [originalOrder, setOriginalOrder] = useState([]);

  const {
    fetchOpeningPrincipal,
    ClearstateOpeningPrincipalList,
    OpeningPrincipalList,
    isOpeningPrincipalLoading,
    isOpeningPrincipalListSuccess,
    isOpeningPrincipalError,
    OpenPrnDelErrMsg,
  } = useFetchOpeningPrincipalReport();

  const {
    OpePrnEditSuccess,
    isOpePrnEditLoading,
    OpePrnEditError,
    ClearStateEditOpePrn,
    EditOpePrnFunc,
  } = useEditOpeningPrincipal();

  const {
    isCheckOpeningPrnLoading,
    CheckOpeningPrnErr,
    CheckOpeningPrn,
    ClearCheckOpeningPrn,
    isCheckOpHeader,
  } = useCheckOpeningPrn();

  const {
    OpeningPrnDeleteMsg,
    isOpeningPrnDeleteLoading,
    OpeningPrnDeleteErr,
    DeleteOpeningPrn,
    ClearOpeningPrnDelete,
    isOpnPrnDeleteSucc,
  } = useOpeningPrnDelete();

  const {
    CheckOpeningPrincipalDeleteCheckMsg,
    isCheckOpeningPrincipalDeleteCheck,
    isCheckOpeningPrincipalDeleteCheckLoading,
    CheckOpeningPrincipalDeleteCheckErr,
    CheckOpeningPrincipalDeleteCheck,
    ClearCheckOpeningPrincipalDeleteCheck,
  } = useOpeningPrincipalDeleteCheck();

  useEffect(() => {
    if (isCheckOpeningPrincipalDeleteCheck === 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isCheckOpeningPrincipalDeleteCheck === 0) {
      toast.dismiss();
      toast.warning(CheckOpeningPrincipalDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckOpeningPrincipalDeleteCheck();
  }, [
    isCheckOpeningPrincipalDeleteCheckLoading,
    isCheckOpeningPrincipalDeleteCheck,
  ]);

  const { user } = useFetchAuth();

  let ColumnPrincipal = [
    {
      headername: "Srl_Prn",
      fieldname: "SRL_PRN",
      type: "number",
      width: "80px",
      isNotEditable: true,
    },
    {
      headername: "EntryDate",
      fieldname: "EntryDate",
      type: "text",
      width: "100px",
      isBongDate: true,
    },
    {
      headername: "Amount",
      fieldname: "AMOUNT",
      type: "number",
      isUseInputRef: true,
    },
    {
      headername: "Mode Of Payment",
      fieldname: "paymode",
      width: "160px",
      type: "String",
      isSelection: true,
      selectionname: "MODE_OF_PAYMENT",
      options: [
        { label: "Cash", value: 1 },
        { label: "UPI", value: 2 },
        { label: "Bank Transfer", value: 3 },
      ],
    },
    {
      headername: "Rem. Wadah",
      fieldname: "ReminderWadah",
      type: "number",
      width: "120px",
    },
    {
      headername: "Act. Wadah",
      fieldname: "ActualWadah",
      type: "number",
      width: "120px",
    },
    {
      headername: "Int. Per %",
      fieldname: "InterestPercentage",
      type: "number",
      width: "100px",
    },
    {
      headername: "Paid Principle",
      fieldname: "Update_Prn_Paid",
      type: "number",
      isNotEditable: true,
      width: "160px",
    },
  ];

  const paymentMode = [
    { label: "Cash", Value: 1 },
    { label: "UPI", Value: 2 },
    { label: "Bank Transfer", Value: 3 },
  ];

  const handleDeleteClick = (index) => {
    const selectedObj = filteredData[index];
    CheckOpeningPrincipalDeleteCheck({
      ID: selectedObj?.ID,
      LotNo: lotno,
      Srl: SRL,
      Srl_prn: selectedObj?.SRL_PRN,
      Cust_Type: entityType,
      TranCode: trancode,
    });
    setItemToDelete(selectedObj);
    //  setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteOpeningPrn({
        ID: itemToDelete?.ID,
        LotNo: lotno,
        Srl: SRL,
        Srl_prn: itemToDelete?.SRL_PRN,
        Cust_Type: entityType,
        TranCode: trancode,
      });
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;
    let currentOrder = "";
    let isAsc = false;
    let isDesc = false;
    if (type == "time") {
      for (let i = 0; i < filteredData.length - 1; i++) {
        let a = parseInt(
          (filteredData[i]?.[header]).toString().replace(/:/g, ""),
          10
        );
        let b = parseInt(
          (filteredData[i + 1]?.[header]).toString().replace(/:/g, ""),
          10
        );
        if (a > b) {
          isAsc = true;
        }
        if (b > a) {
          isDesc = true;
        }
      }
      console.log(isAsc, isDesc);
      if (isAsc) {
        currentOrder = "Desc";
      }
      if (isDesc) {
        currentOrder = "Asc";
      }
    } else {
      currentOrder = checkOrder(filteredData, header);
    }
    console.log(currentOrder);

    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    } else if (type == "BongDate") {
      result = BongDateSorting(newOrder, filteredData, header);
    } else if (type == "time") {
      result = SortArrayByTime(newOrder, filteredData, header);
    }

    setFilteredData(result);
    // setOriginalOrder(result.map((row) => row.ID));
  };

  const onChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;

    console.log(key,value,"Key value")
    if (key == "EntryDate") {
      if(headerEntryDate > value){
        toast.warning(`Entry Date Should be greater than ${headerEntryDate}`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
 }
    let regex = {
      AMOUNT: /^\d*\.?\d{0,2}$/,
      InterestPercentage: /^\d*\.?\d{0,2}$/,
    };

    if (regex[key] && regex[key].test(value)) {
      // Special check for AMOUNT < Valuation
      if (key === "AMOUNT") {
        const valuation = Valuation || 0; // Assume valuation is already in editedData
        if (parseFloat(value) <= parseFloat(valuation)) {
          setEditedData((prev) => ({ ...prev, [key]: value }));
        } else {
          toast.warning(
            `${value} Amount Should be lesser than Valuation ${Valuation}`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        }
      } else {
        setEditedData((prev) => ({ ...prev, [key]: value }));
      }
    } else if (!regex[key]) {
      setEditedData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const SaveHandler = (index) => {
    // console.log(EditedData);
    EditOpePrnFunc({
      LotNo: lotno,
      Srl: SRL,
      Srl_prn: EditedData?.SRL_PRN,
      Cust_Type: entityType,
      TranCode: trancode,
      ...EditedData,
    });
  };
  // console.log(EditedData, "edited data");
  //after hit edit button
  const FetchActionId = (index) => {
    setParams((prev) => ({ ...prev, SelectedID: index, isAction: true }));
    let { createdAt, updatedAt, ...remaining } = filteredData[index];
    setEditedData(remaining);
    CheckOpeningPrn({
      LotNo: lotno,
      Srl: SRL,
      Srl_prn: filteredData[index]?.SRL_PRN,
      Cust_Type: entityType,
      TranCode: trancode,
    });
  };

  // prn data api call
  useEffect(() => {
    fetchOpeningPrincipal({
      DetailID: id,
      CompanyID: user?.CompanyID,
      Cust_Type: entityType,
      TranCode: trancode,
    });
  }, [id, OpePrnEditSuccess, isOpnPrnDeleteSucc, entityType, trancode]);

  //prn data load in filter
  //prn data load in filter
  useEffect(() => {
    if (isOpeningPrincipalListSuccess) {
      if (OpeningPrincipalList && OpeningPrincipalList.length > 0) {
        let newArray = OpeningPrincipalList?.map((item, index) => {
          let obj = paymentMode?.find(
            (mode) =>
              parseInt(mode?.Value, 10) == parseInt(item?.MODE_OF_PAYMENT, 10)
          );
          return { ...item, paymode: obj?.label || "UnKnown" };
        });
        newArray.sort((a, b) => a?.SRL_PRN - b?.SRL_PRN);
        setFilteredData(newArray);
      }
    }
    if (isOpeningPrincipalError) {
      toast.dismiss();
      toast.error("No Data Found", { position: "top-right", autoClose: 3000 });
      setFilteredData([]);
      HandleClose();
    }
    ClearstateOpeningPrincipalList();
    setParams({ ...params, isAction: false, ActionId: -1 });
  }, [
    id,
    OpeningPrincipalList,
    OpePrnEditSuccess,
    isOpnPrnDeleteSucc,
    isOpeningPrincipalError,
  ]);

  //AutoClaculation
  useEffect(() => {
    if (EditedData?.GROSS_WT && EditedData?.RATE && EditedData?.PERCENTAGE) {
      let netwt = (
        (parseFloat(EditedData?.GROSS_WT) *
          parseFloat(EditedData?.PERCENTAGE)) /
        100
      ).toFixed(3);
      let val = (parseFloat(netwt) * parseFloat(EditedData?.RATE)).toFixed(2);
      console.log(netwt, val);
      setEditedData((prev) => ({ ...prev, NET_WT: netwt, Valuation: val }));
    }
  }, [EditedData?.GROSS_WT, EditedData?.RATE, EditedData?.PERCENTAGE]);

  //toaster of edit prn
  useEffect(() => {
    if (OpePrnEditSuccess) {
      toast.success(OpePrnEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (OpePrnEditError) {
      toast.error(OpePrnEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setParams({ ...params, ActionID: -1, IsAction: false });
    setEditedData({
      SRL: null,
      Description: null,
      GROSS_WT: null,
      PERCENTAGE: null,
      NET_WT: null,
      RATE: null,
      Valuation: null,
    });
    ClearStateEditOpePrn();
  }, [isOpePrnEditLoading, OpePrnEditSuccess, OpePrnEditError]);

  //check editable or not then open for edit
  useEffect(() => {
    // console.log(
    //   "hi",
    //   CheckOpeningPrnErr,
    //   isCheckOpHeader,
    //   isCheckOpeningPrnLoading
    // );
    if (isCheckOpHeader == 1) {
      setParams((prev) => ({
        ...prev,
        isAction: true,
        ActionId: params?.SelectedID,
      }));
    } else if (isCheckOpHeader == 0) {
      toast.dismiss();
      toast.warning(CheckOpeningPrnErr, {
        position: "top-right",
        autoClose: 3000,
      });
      setParams((prev) => ({
        ...prev,
        isAction: false,
        ActionId: -1,
      }));
    }
    ClearCheckOpeningPrn();
  }, [isCheckOpeningPrnLoading, isCheckOpHeader]);
  //toaster delete
  useEffect(() => {
    if (isOpnPrnDeleteSucc) {
      toast.success(OpeningPrnDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (OpeningPrnDeleteErr) {
      toast.error(OpeningPrnDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearOpeningPrnDelete();
  }, [isOpnPrnDeleteSucc, OpeningPrnDeleteErr, isOpeningPrnDeleteLoading]);

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [EditedData.ID]);
  return (
    <div className="table-box" style={{ maxHeight: "55vh" }}>
      <Table
        tab={filteredData || []}
        Col={ColumnPrincipal}
        isLoading={isOpeningPrincipalLoading}
        isEdit={true}
        isDelete={true}
        setParams={setParams}
        onSorting={SortingFunc}
        ActionFunc={FetchActionId}
        ActionId={params?.ActionId}
        EditedData={EditedData}
        OnChangeHandler={onChangeHandler}
        OnSaveHandler={SaveHandler}
        // handleDelete={DeletePrnDetail}
        handleDelete={handleDeleteClick}
        width={"81vw"}
        useInputRef={editinputref}
        toaster={toast}
        bongView={bongView}
        setBongView={setBongView}
        CloseBongCal={() => {
          setBongView(false);
        }}
      />

      <DeleteConfirmation
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default PrincipalEntryView;
