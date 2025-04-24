import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchOpeningDetailReport from "../../store/ShowStore/useFetchOpeningDetailReport";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import Table from "../../Component/Table";
import ReusableModal from "../../Component/ReusableModal";
import "./openentry.css";
import PrincipalEntryView from "./PrincipalEntryView";
import useCheckOpeningDetails from "../../store/Checker/useCheckOpeningDetails";
import useEditOpeningDetail from "../../store/UpdateStore/useEditOpeningDetail";
import useOpeningDetailDelete from "../../store/DeleteStore/useOpeningDetailDelete";
import useFetchOpeningPrincipalReport from "../../store/ShowStore/useFetchOpeningPrincipalReport";
import DeleteConfirmation from "../../Component/ReusableDelete";
import useOpeningDetailDeleteCheck from "../../store/Checker/useOpeningDetailDeleteCheck";
function OpeningEntryDetailTable({ id, lotno, onCloseHandler, entityType }) {
  const editinputref = useRef(null);
  const [focusText, setfocusText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  //  const [itemToDelete, setItemToDelete] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({
    SRL: null,
    Description: null,
    GROSS_WT: null,
    PERCENTAGE: null,
    NET_WT: null,
    RATE: null,
    Valuation: null,
  });
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [itemToDelete, setItemToDelete] = useState(null);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    page: 1,
    limit: 10,
    view: false,
    SRL: null,
  });
  const {
    CheckOpeningDetailsMsg,
    isCheckOpeningDetailsLoading,
    CheckOpeningDetailsErr,
    isCheckOpDetail,
    CheckOpeningDetails,
    ClearCheckOpeningDetails,
  } = useCheckOpeningDetails();
  const {
    ClearStateEditOpeningDetail,
    EditOpeningDetailFunc,
    OpeningDetailEditError,
    isOpeningDetailEditLoading,
    OpeningDetailEditSuccess,
  } = useEditOpeningDetail();
  const { user } = useFetchAuth();
  const {
    fetchOpeningDetail,
    ClearstateOpeningDetailList,
    OpeningDetailList,
    isOpeningDetailListSuccess,
    OpnDetailErrMsg,
    isOpeningDetailLoading,
    isOpeningDetailError,
  } = useFetchOpeningDetailReport();
  const {
    OpeningDetailDeleteMsg,
    ClearOpeningDetailDelete,
    DeleteOpeningDetail,
    OpeningDetailDeleteErr,
    isOpeningDetailDeleteLoading,
  } = useOpeningDetailDelete();

    const {
      CheckOpeningDetailDeleteCheckMsg,
      isCheckOpeningDetailDeleteCheck,
      isCheckOpeningDetailDeleteCheckLoading,
      CheckOpeningDetailDeleteCheckErr,
      CheckOpeningDetailDeleteCheck,
      ClearCheckOpeningDetailDeleteCheck,
  } = useOpeningDetailDeleteCheck();
  
  // console.log(isCheckOpeningDetailDeleteCheck, "isCheckOpeningDetailDeleteCheck");

    useEffect(() => {
      if (isCheckOpeningDetailDeleteCheck === 1) {
        // If check passes, show the delete confirmation modal
        if (itemToDelete) {
          setShowDeleteModal(true);
        }
      } else if (isCheckOpeningDetailDeleteCheck === 0) {
        toast.dismiss();
        toast.warning(CheckOpeningDetailDeleteCheckErr, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      ClearCheckOpeningDetailDeleteCheck();
    }, [isCheckOpeningDetailDeleteCheckLoading, isCheckOpeningDetailDeleteCheck]);
  
  
  const { isOpeningPrincipalError, OpenPrnDelErrMsg } =
    useFetchOpeningPrincipalReport();
  let ColumnDetail = [
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "number",
      width: "45px",
      isNotEditable: true,
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "string",
      width: "145px",
      isShortingOff: true,
      isUseInputRef: true,
    },
    {
      headername: "Gross Weight",
      fieldname: "GROSS_WT",
      type: "number",
    },
    {
      headername: "Purity(%)",
      fieldname: "PERCENTAGE",
      type: "number",
    },
    {
      headername: "Net Weight",
      fieldname: "NET_WT",
      type: "number",
      isReadOnly: true,
    },

    {
      headername: "Rate",
      fieldname: "RATE",
      type: "number",
    },
    {
      headername: "Valuation",
      fieldname: "Valuation",
      type: "number",
      isReadOnly: true,
    },
  ];

  const handleDeleteClick = (index) => {
    const selectedData = filteredData[index];
      CheckOpeningDetailDeleteCheck({
        ID: selectedData.ID,
        Cust_Type: entityType,
        Srl: selectedData.SRL,
        LotNo:lotno,
      });
    setItemToDelete(selectedData);
    // setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteOpeningDetail({
        ID: itemToDelete.ID,
        LotNo: lotno,
        Srl: itemToDelete.SRL,
        Cust_Type: entityType,
      });
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  const handleViewClick = (tabindex) => {
    //  console.log(tabindex);
    const selectedData = filteredData[tabindex];
    setSelectedId(selectedData.ID);
    // console.log(selectedData?.SRL);
    setParams((prev) => ({ ...prev, SRL: selectedData?.SRL, view: true }));
    // HandleOpen();
  };
  const handleClose = () => {
    setParams({ ...params, view: false });
  };
  const EditCheckfunc = async (tabindex) => {
    const selectedData = filteredData[tabindex];
    console.log(selectedData);
    CheckOpeningDetails({
      LotNo: lotno,
      Srl: selectedData.SRL,
      Cust_Type: entityType,
    });
    setSelectedId(tabindex);
    let { WareHouse, createdAt, updatedAt, ...leftall } =
      filteredData[tabindex];
    setEditedData(leftall);
  };
  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    let regex = {
      GROSS_WT: /^\d*\.?\d{0,3}$/,
      RATE: /^\d*\.?\d{0,2}$/,
      PERCENTAGE: /^\d*\.?\d{0,2}$/,
    };
    if (regex[key] && regex[key].test(value)) {
      setEditedData((prev) => ({ ...prev, [key]: value }));
    } else if (!regex[key]) {
      setEditedData((prev) => ({ ...prev, [key]: value }));
    }
  };
  const SaveHandler = (index) => {
    console.log({ ...editedData, LotNo: lotno });
    EditOpeningDetailFunc({
      ...editedData,
      LotNo: lotno,
      Cust_Type: entityType,
    });
  };

  //AutoClaculation
  useEffect(() => {
    if (editedData?.GROSS_WT && editedData?.RATE && editedData?.PERCENTAGE) {
      let netwt = (
        (parseFloat(editedData?.GROSS_WT) *
          parseFloat(editedData?.PERCENTAGE)) /
        100
      ).toFixed(3);
      let val = (parseFloat(netwt) * parseFloat(editedData?.RATE)).toFixed(2);
      console.log(netwt, val);
      setEditedData((prev) => ({ ...prev, NET_WT: netwt, Valuation: val }));
    }
  }, [editedData?.GROSS_WT, editedData?.RATE, editedData?.PERCENTAGE]);
  //toaster of edit detail
  useEffect(() => {
    if (OpeningDetailEditSuccess) {
      toast.success(OpeningDetailEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (OpeningDetailEditError) {
      toast.error(OpeningDetailEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditOpeningDetail();
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
  }, [
    OpeningDetailEditSuccess,
    OpeningDetailEditError,
    isOpeningDetailEditLoading,
  ]);
  //call api
  useEffect(() => {
    fetchOpeningDetail({
      HeaderId: id,
      CompanyID: user?.CompanyID,
      page: 1,
      limit: 10,
      Cust_Type: entityType,
    });
  }, [
    id,
    OpeningDetailEditSuccess,
    OpeningDetailDeleteMsg,
    isOpeningPrincipalError,
    entityType,
  ]);
  //set filtered data
  useEffect(() => {
    if (isOpeningDetailListSuccess) {
      if (originalOrder.length == 0 && OpeningDetailList.length > 0) {
        setFilteredData(OpeningDetailList);
      } else if (OpeningDetailList.length > 0 && originalOrder.length > 0) {
        let sortedData = originalOrder?.map((id) =>
          OpeningDetailList?.find((row) => row?.ID == id)
        );
        setFilteredData(sortedData);
      }
    }
    // if (isOpeningDetailError || isOpeningPrincipalError) {
    if (isOpeningDetailError) {
      // console.log("hi");
      setOriginalOrder((prev) => []);
      setFilteredData((prev) => []);
      onCloseHandler();
      // if (!isOpeningPrincipalError) {
      toast.error(OpnDetailErrMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      // }
    }
    ClearstateOpeningDetailList();
  }, [
    isOpeningDetailLoading,
    isOpeningDetailListSuccess,
    isOpeningDetailError,
    OpeningDetailEditSuccess,
    OpeningDetailDeleteMsg,
    isOpeningPrincipalError,
  ]);

  //check editable or not then open for edit
  useEffect(() => {
    if (isCheckOpDetail == 1) {
      setParams((prev) => ({ ...prev, IsAction: true, ActionID: selectedId }));
    } else if (isCheckOpDetail == 2) {
      toast.dismiss();
      toast.warning(CheckOpeningDetailsErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckOpeningDetails();
  }, [isCheckOpeningDetailsLoading, isCheckOpDetail]);
  //toaster for delete
  useEffect(() => {
    // toast.dismiss();
    if (OpeningDetailDeleteMsg) {
      toast.success(OpeningDetailDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (OpeningDetailDeleteErr) {
      toast.error(OpeningDetailDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    // let timeid = setTimeout(() => {
    //   ClearOpeningDetailDelete();
    // }, 2000);
    ClearOpeningDetailDelete();
    // return () => clearTimeout(timeid);
  }, [
    OpeningDetailDeleteMsg,
    OpeningDetailDeleteErr,
    isOpeningDetailDeleteLoading,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.ID]);
  return (
    <div>
      <div>
        <textarea
          placeholder="Text"
          value={focusText.toString()}
          style={{
            width: "100%",
            border: "1px solid lightgrey",
            borderRadius: "2px",
            padding: "3px 8px",
          }}
        />
      </div>
      <div
        className="table-box"
        style={{ height: "55vh", border: "1px solid lightgrey" }}
      >
        <Table
          tab={filteredData || []}
          Col={ColumnDetail}
          isLoading={isOpeningDetailLoading}
          isView={true}
          isEdit={true}
          isDelete={true}
          setParams={setParams}
          handleViewClick={handleViewClick}
          getFocusText={(value) => {
            setfocusText(value);
          }}
          ActionId={params?.ActionID}
          ActionFunc={EditCheckfunc}
          EditedData={editedData}
          OnChangeHandler={OnChangeHandler}
          OnSaveHandler={SaveHandler}
          // handleDelete={DeleteDetailData}
          handleDelete={handleDeleteClick}
          useInputRef={editinputref}
        />
        <DeleteConfirmation
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
        {/* <Modal/> */}
        <ReusableModal
          show={params?.view}
          handleClose={handleClose}
          body={
            <PrincipalEntryView
              id={selectedId}
              lotno={lotno}
              SRL={params?.SRL}
              HandleClose={handleClose}
              entityType={entityType}
            />
          }
          Title={"Opening Principal Detail View"}
          isPrimary={true}
          handlePrimary={handleClose}
          PrimaryButtonName={"Close"}
        />
      </div>
    </div>
  );
}

export default OpeningEntryDetailTable;
