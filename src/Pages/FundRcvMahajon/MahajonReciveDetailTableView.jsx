import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchOpeningDetailReport from "../../store/ShowStore/useFetchOpeningDetailReport";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import Table from "../../Component/Table";
import ReusableModal from "../../Component/ReusableModal";
import "./openentry.css";
import useCheckOpeningDetails from "../../store/Checker/useCheckOpeningDetails";
import useEditOpeningDetail from "../../store/UpdateStore/useEditOpeningDetail";
import useOpeningDetailDelete from "../../store/DeleteStore/useOpeningDetailDelete";
import useFetchOpeningPrincipalReport from "../../store/ShowStore/useFetchOpeningPrincipalReport";
import DeleteConfirmation from "../../Component/ReusableDelete";
import useOpeningDetailDeleteCheck from "../../store/Checker/useOpeningDetailDeleteCheck";
import { useNavigate } from "react-router-dom";
import useAddExtraItem from "../../store/AddStore/useAddExtraItem";
import MahajonRecivePrincipalTableView from "./MahajonRecivePrincipalTableView";
function MahajonReciveDetailTableView({
  id,
  onCloseHandler,
  entityType,
  trancode,
  info,
  headerData,
}) {
  console.log(info, "info");
  //-----------------------------------useref hook-----------------------------------//
  const editinputref = useRef(null);
  const navigate = useNavigate();
  //--------------------------------------useState--------------------------------------//
  const [focusText, setfocusText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [search, setSearch] = useState("");
  const [editedData, setEditedData] = useState({
    SRL: null,
    Description: null,
    GROSS_WT: null,
    PERCENTAGE: null,
    NET_WT: null,
    RATE: null,
    Valuation: null,
  });
  const newRow = {
    srl: 1, // Auto-assigned SRL
    description: "",
    grossWeight: "",
    percentage: "",
    netWeight: "",
    rate: 0,
    valuation: "",
    principalAmount: "",
    principalDetails: [],
    ...headerData,
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    page: 1,
    limit: 10,
    view: false,
    SRL: null,
    Valuation: null,
    isAdd: false,
    ItemCounter: 0,
    isDelete: false,
    LotNo : null
  });
  //-----------------------------------API Call---------------------------------------------------//
  const { user } = useFetchAuth();
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
    isOpeningDetailEditLoading,
    OpeningDetailEditError,
    isOpeningDetailEditError,
    OpeningDetailEditSuccess,
    isOpeningDetailEditSucc,
  } = useEditOpeningDetail();
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
  const { isOpeningPrincipalError, OpenPrnDelErrMsg } = useFetchOpeningPrincipalReport();

  const { ExtraItemAddSuccess } = useAddExtraItem();

  //------------------------------------function---------------------------------------------------//
  const handleDeleteClick = (index) => {
    const selectedData = filteredData[index];

    CheckOpeningDetailDeleteCheck({
      ID: selectedData.ID,
      Cust_Type: entityType,
      TranCode: trancode,
      Srl: selectedData.SRL,
      LotNo: selectedData?.LotNo,
    });
    setItemToDelete(selectedData);
    // setShowDeleteModal(true);
  };
  // Confirm delete action
  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteOpeningDetail({
        ID: itemToDelete.ID,
        LotNo: itemToDelete?.LotNo,
        Srl: itemToDelete.SRL,
        Cust_Type: entityType,
        TranCode: trancode,
      });
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  }; 
  const handleSearch = (e) => {
    const value = search.toLowerCase();

    // Extract valid field names from the Col array
    const validFields = ColumnDetail.map((col) => col.fieldname);

    const filtered = OpeningDetailList?.filter((order) =>
      validFields?.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };
  const SaveHandler = () => {
    EditOpeningDetailFunc(
      {
        ...editedData,
        RATE:editedData?.GOLD_RATE,
        Cust_Type: entityType,
        TranCode: trancode,
      }
    );
  };
  const handleClickClose = (rowdata) => {
    // onCloseHandler();
    // console.log(srl, "info");
    if (entityType == 3) {
      navigate("/auth/metal-return-view?type=mahajon", {
        state: {
          customertype: entityType,
          custId: info?.custId,
          lotNo: rowdata?.LotNo,
          srl: rowdata?.SRL,
        },
      });
    } 
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleViewClick = (tabindex) => {
    //  console.log(tabindex);
    const selectedData = filteredData[tabindex];
    console.log(selectedData, "selected data");
    setSelectedId(selectedData.ID);
    // console.log(selectedData?.SRL);
    setParams((prev) => ({
      ...prev,
      SRL: selectedData?.SRL,
      view: true,
      Valuation: selectedData.Valuation,
      LotNo: selectedData?.LotNo,
      Update_Return_Metal: selectedData?.Update_Return_Metal,
    }));
    // HandleOpen();
  };

  const handleClose = () => {
    setParams({ ...params, view: false });
  };
//edit check
  const EditCheckfunc = async (tabindex) => {
    const selectedData = filteredData[tabindex];

    CheckOpeningDetails({
      LotNo: selectedData?.LotNo,
      Srl: selectedData.SRL,
      Cust_Type: entityType,
      TranCode: trancode,
      DetailID: selectedData?.DetailID,
    });

    setSelectedId(tabindex);
    let { WareHouse, createdAt, updatedAt, ...leftall } = filteredData[tabindex];
    setEditedData(leftall);
  };
//edit change 
  const OnChangeHandler = (index, e) => {
   
    let key = e.target.name;
    let value = e.target.value;
  
    let regex = {
      GOLD_RATE: /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})?$/,
      Valuation: /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})?$/,
    };
    console.log(value, key, regex[key]);
    if (regex[key] && regex[key].test(value)) {
      if (key == "Valuation") {
        let rate =parseFloat(value/ editedData?.NET_WT).toFixed(2);
        setEditedData((prev) => ({ ...prev, GOLD_RATE: rate, [key]: value }));
      } else if (key == "GOLD_RATE") {
        let valuation = editedData?.NET_WT * value;
        setEditedData((prev) => ({
          ...prev,
          [key]: value,
          Valuation: valuation,
        }));
      }
    } else {
      return;
    }
  };



  //toaster of edit detail
  useEffect(() => {
    if (isOpeningDetailEditSucc && !isOpeningDetailDeleteLoading) {
      toast.success(OpeningDetailEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (isOpeningDetailEditError && !isOpeningDetailDeleteLoading) {
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
      GOLD_RATE: null,
      RATE: null,
      Valuation: null,
    });
  }, [
    isOpeningDetailEditSucc,
    isOpeningDetailEditError,
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
      TranCode: trancode,
    });
  }, [
    id,
    ExtraItemAddSuccess,
    isOpeningDetailEditSucc,
    OpeningDetailDeleteMsg,
    isOpeningPrincipalError,
    entityType,
    trancode,
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
    if (isOpeningDetailError) {
      setOriginalOrder([]);
      setFilteredData([]);
      onCloseHandler();
      toast.error(OpnDetailErrMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearstateOpeningDetailList();
  }, [
    isOpeningDetailListSuccess,
    isOpeningDetailEditSucc,
    ExtraItemAddSuccess,
    isOpeningDetailError,
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
    
    ClearOpeningDetailDelete();
  }, [
    OpeningDetailDeleteMsg,
    OpeningDetailDeleteErr,
    isOpeningDetailDeleteLoading,
  ]);

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

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.ID]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      isAdd: false,
      isDelete: false,
      ItemCounter: 0,
      lastSrl: 0,
    }));
  }, [ExtraItemAddSuccess]);

  //----------------------------------------const & var-------------------------------------------//
  let ColumnDetail = [
    {
      headername: "Cost Center",
      fieldname: "CostCenterName",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "LotNo",
      fieldname: "LotNo",
      type: "String",
      width: "120px",
      isNotEditable: true,
    },
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
      width: "200px",
      isNotEditable: true,
    },
    {
      headername: "Gross Weight",
      fieldname: "GROSS_WT",
      type: "number",
      isNotEditable: true,
    },
    {
      headername: "Purity(%)",
      fieldname: "PERCENTAGE",
      type: "number",
      isNotEditable: true,
    },
    {
      headername: "Net Weight",
      fieldname: "NET_WT",
      type: "number",
      isReadOnly: true,
      isNotEditable: true,
    },

    {
      headername: "Rate",
      fieldname: "GOLD_RATE",
      type: "number",
      isUseInputRef: true,
    },
    {
      headername: "Valuation",
      fieldname: "Valuation",
      type: "number",
    },
    {
      headername: "Closing Status",
      fieldname: "Update_Return_Metal",
      type: "number",
      isReadOnly: true,
      isShortingOff: true,
      isIconicData: true,
      iconError: (rowData) => (
        <button className="btn btn-link p-0" type="button">
          <i
            className="bi bi-bootstrap-reboot"
            style={{ color: "orange", fontSize: "22px" }}
          ></i>
        </button>
      ),

      iconSuccess: (rowData) => (
        <button
          className="btn btn-link p-0"
          type="button"
          onClick={() => handleClickClose(rowData)} // Pass SRL here
        >
          <i
            className="bi bi-check2-circle"
            style={{ color: "green", fontSize: "22px" }}
          ></i>
        </button>
      ),
    },
  ];
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
        <div>
          <textarea
            value={focusText}
            type="search"
            readOnly
            placeholder="Detail View"
            style={{
              width: "50vw",
              border: "1px solid dodgerblue",
              outline: "1px solid dodgerblue",
              borderRadius: "5px",
              padding: "0px 5px",
            }}
          />
        </div>
        <div>
          <label
            className="form-input"
            style={{
              width: "28vw",
              border: "1px solid dodgerblue",
              borderRadius: "5px",
              padding: "5px",
              outline: "1px solid dodgerblue",
              display: "flex",
              alignItems: "center",
              // borderColor: "#25a353",
            }}
          >
            <i
              className="bi bi-search"
              style={{
                fontSize: "16px",
              }}
            ></i>
            <input
              value={search}
              type="search"
              placeholder="Search here....."
              style={{
                width: "80%",
                border: "none",
                outline: "none",
                padding: "0px 5px",
              }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="table-box">
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
          height={"80vh"}
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
          isFullScreen={true}
          body={
            <MahajonRecivePrincipalTableView
              id={selectedId}
              lotno={params?.LotNo}
              SRL={params?.SRL}
              HandleClose={handleClose}
              entityType={entityType}
              trancode={trancode}
              Valuation={params.Valuation}
              headerEntryDate={headerData?.EntryDate}
              Update_Return_Metal={params?.Update_Return_Metal}
            />
          }
          Title={`${
            trancode === "0RM" ? "Opening" : "Recive/Dafa"
          } Principal Details from Mahajon`}
          isPrimary={true}
          handlePrimary={handleClose}
          PrimaryButtonName={"Close"}
        />
      </div>
    </div>
  );
}

export default MahajonReciveDetailTableView;
