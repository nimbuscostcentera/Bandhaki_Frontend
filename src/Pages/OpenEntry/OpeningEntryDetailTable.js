import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./openentry.css";

import AddItem from "./AddItem";
import Table from "../../Component/Table";
import PrincipalEntryView from "./PrincipalEntryView";
import ReusableModal from "../../Component/ReusableModal";
import DeleteConfirmation from "../../Component/ReusableDelete";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddExtraItem from "../../store/AddStore/useAddExtraItem";
import useCheckOpeningDetails from "../../store/Checker/useCheckOpeningDetails";
import useEditOpeningDetail from "../../store/UpdateStore/useEditOpeningDetail";
import useOpeningDetailDelete from "../../store/DeleteStore/useOpeningDetailDelete";
import useOpeningDetailDeleteCheck from "../../store/Checker/useOpeningDetailDeleteCheck";
import useFetchOpeningDetailReport from "../../store/ShowStore/useFetchOpeningDetailReport";
import useFetchOpeningPrincipalReport from "../../store/ShowStore/useFetchOpeningPrincipalReport";
import useEditOpeningPrincipal from "../../store/UpdateStore/useEditOpeningPrincipal";
import useOpeningPrnDelete from "../../store/DeleteStore/useOpeningPrnDelete";
import useAddPrn from "../../store/AddStore/useAddPrn";

function OpeningEntryDetailTable({
  id,
  lotno,
  onCloseHandler,
  entityType,
  trancode,
  rendering,
  info,
  headerData,
}) {
  //-----------------------------------useref hook-----------------------------------//
  const editinputref = useRef(null);
  const navigate = useNavigate();
  //--------------------------------------useState--------------------------------------//
  const [focusText, setfocusText] = useState("");
  const [trackchange, setTrackChange] = useState({
    index: 0,
    value: 0,
    name: 0,
  });

  const [lastSrl , setLastSrl] = useState(0);
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
    OpeningDetailEditError,
    isOpeningDetailEditLoading,
    OpeningDetailEditSuccess,
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
  const { isOpeningPrincipalError, OpenPrnDelErrMsg } =
    useFetchOpeningPrincipalReport();
  const { ExtraItemAddSuccess } = useAddExtraItem();
  const { OpePrnEditSuccess, isOpeningPrnEditSucc } = useEditOpeningPrincipal;
  const { isOpnPrnDeleteSucc } = useOpeningPrnDelete;
  const { AddPrnSuccess } = useAddPrn;

  //------------------------------------function---------------------------------------------------//
  const handleDeleteClick = (index) => {
    const selectedData = filteredData[index];
    CheckOpeningDetailDeleteCheck({
      ID: selectedData.ID,
      Cust_Type: entityType,
      TranCode: trancode,
      Srl: selectedData.SRL,
      LotNo: lotno,
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
  const handleAdd = () => {
    setParams((prev) => ({
      ...prev,
      isAdd: true,
      ItemCounter: prev?.ItemCounter + 1,
      isDelete: false,
    }));
  };
  const handleClickClose = (srl) => {
    if (entityType == 1) {
      navigate("/auth/metal-return-view?type=customer", {
        state: {
          customertype: entityType,
          custId: info?.custId,
          lotNo: info?.LotNo,
          srl: srl,
        },
      });
    } else if (entityType == 2) {
      navigate("/auth/metal-return-view?type=wholeseller", {
        state: {
          customertype: entityType,
          custId: info?.custId,
          lotNo: info?.LotNo,
          srl: srl,
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
    const selectedData = filteredData[tabindex];
    setSelectedId(selectedData.ID);
    setParams((prev) => ({
      ...prev,
      SRL: selectedData?.SRL,
      view: true,
      Valuation: selectedData.Valuation,
    }));
    // HandleOpen();
  };
  const handleClose = () => {
    setParams({ ...params, view: false });
  };
  const EditCheckfunc = async (tabindex) => {
    const selectedData = filteredData[tabindex];
    CheckOpeningDetails({
      LotNo: lotno,
      Srl: selectedData.SRL,
      Cust_Type: entityType,
      TranCode: trancode,
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
      NET_WT: /^\d*\.?\d{0,3}$/,
      RATE: /^\d*\.?\d{0,2}$/,
      Valuation: /^\d*\.?\d{0,2}$/,
      PERCENTAGE: /^\d*\.?\d{0,2}$/,
    };

    if (key == "NET_WT" && value > editedData?.GROSS_WT) {
      value = "";
      setEditedData((prev) => ({
        ...prev,
        ["Valuation"]: "",
        ["PERCENTAGE"]: "",
      }));
      toast.error("Net Weight should be less than or equal to Gross Weight");
    }

    if (key == "GROSS_WT" && value < editedData?.NET_WT) {
      value = "";
      setEditedData((prev) => ({
        ...prev,
        ["NET_WT"]: "",
        ["PERCENTAGE"]: "",
        ["Valuation"]: "",
      }));
      toast.error("Net Weight should be less than or equal to Gross Weight");
    }

    if (key == "PERCENTAGE" && value > 100) {
      setEditedData((prev) => ({ ...prev, ["NET_WT"]: "", ["Valuation"]: "" }));
      value = "";
      toast.error("Purity can not be greater than 100%");
    }

    if (regex[key] && regex[key].test(value)) {
      setEditedData((prev) => ({ ...prev, [key]: value }));
    } else if (!regex[key]) {
      setEditedData((prev) => ({ ...prev, [key]: value }));
    }
    console.log(key, value);
    // Track the change to trigger calculations
    setTrackChange(() => ({
      index,
      name: key,
      value,
    }));
  };
  const SaveHandler = (index) => {
    console.log(editedData,"save in");
    if (editedData?.Update_Prn_Rcv > editedData?.Valuation) {
      toast.error(
        `Valuation should not be less than Total Principle Amount ${editedData?.Update_Prn_Rcv}`
      );
      return;
}
    EditOpeningDetailFunc({
      ...editedData,
      LotNo: lotno,
      Cust_Type: entityType,
      TranCode: trancode,
    });
  };
//-----------------------------------------useEffcets---------------------------------//
  //AutoClaculation
  useEffect(() => {
    if (trackchange.index === undefined || !trackchange.name) return;

    const { index, name, value } = trackchange;
    let row = { ...editedData };
    // eslint-disable-next-line default-case
    switch (name) {
      case "RATE":
        row.Valuation = "";
        break;
      case "NET_WT":
        row.Valuation = "";
        row.PERCENTAGE = "";
        break;
      case "GROSS_WT":
        row.Valuation = "";
        row.NET_WT = "";
        row.PERCENTAGE = "";
        break;
      case "PERCENTAGE":
        row.NET_WT = "";
        row.Valuation = "";
        break;
      case "Valuation":
        row.RATE = "";
        // Don't reset percentage when valuation changes
        break;
      // Don't reset any fields when description changes
      case "description":
        break;
    }

    // Get current values (use updated values where available)
    const grossWeight =
      name === "GROSS_WT"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.GROSS_WT) || 0;
    const netWeight =
      name === "NET_WT"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.NET_WT) || 0;
    const percentage =
      name === "PERCENTAGE"
        ? Number.parseFloat(value > 100 ? 0 : value) || 0
        : Number.parseFloat(row.PERCENTAGE) || 0;
    const rate =
      name === "RATE"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.RATE) || 0;

    // Skip calculations if we're just changing the description
    if (name === "description") return;

    if (netWeight != "" && grossWeight != "" && netWeight > grossWeight) {
      row.Valuation = "";
      row.PERCENTAGE = "";
    }

    let calculatedNetWeight = netWeight,
      recalculatedPercentage = 0,
      val = 0;

    // Calculate netWeight if grossWeight and percentage are provided
    if (
      grossWeight !== "" &&
      netWeight !== "" &&
      name !== "NET_WT" &&
      name == "PERCENTAGE"
    ) {
      calculatedNetWeight = grossWeight * (percentage / 100);
      row.NET_WT = calculatedNetWeight.toFixed(2);
    }
    if (
      grossWeight > 0 &&
      (calculatedNetWeight > 0 || netWeight > 0) &&
      name !== "PERCENTAGE" &&
      (name == "GROSS_WT" || name == "NET_WT")
    ) {
      // Recalculate percentage based on the new netWeight (to ensure consistency)
      recalculatedPercentage =
        ((calculatedNetWeight > 0 ? calculatedNetWeight : netWeight) /
          grossWeight) *
        100;
      row.PERCENTAGE = Number.parseFloat(recalculatedPercentage.toFixed(2));
      // row.Valuation = ((calculatedNetWeight || netWeight) * rate).toFixed(2);
    }

    // Calculate valuation if netWeight and rate are provided
    if ((calculatedNetWeight > 0 || netWeight > 0) && rate > 0) {
      console.log(row.Valuation, "row.Valuation");
      val = (calculatedNetWeight <= 0 ? netWeight : calculatedNetWeight) * rate;
      row.Valuation = val.toFixed(2);
    }
    setEditedData(row);
  }, [trackchange]);

  
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
      TranCode: trancode,
    });
  }, [
    id,
    params?.view,
    ExtraItemAddSuccess,
    OpeningDetailEditSuccess,
    OpeningDetailDeleteMsg,
    isOpeningPrincipalError,
    entityType,
    trancode,
    AddPrnSuccess,
    isOpnPrnDeleteSucc,
    isOpeningPrnEditSucc, 
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


      setLastSrl(OpeningDetailList[OpeningDetailList?.length - 1]?.SRL);
    }
    // if (isOpeningDetailError || isOpeningPrincipalError) {
    if (isOpeningDetailError) {
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
    ExtraItemAddSuccess,
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
    // return () => clearTimeout(timeid);
  }, [
    OpeningDetailDeleteMsg,
    OpeningDetailDeleteErr,
    isOpeningDetailDeleteLoading,
  ]);
  //delete check
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
  //focus manager
  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.ID]);
  //search handler calling
  useEffect(() => {
    // if (search.length > 0) {
    handleSearch();
    // }
  }, [search]);
  //clear all
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
      width: "160px",
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
    },
    {
      headername: "Closing Status",
      fieldname: "Update_Return_Metal",
      type: "number",
      isReadOnly: true,
      isShortingOff: true,
      isIconicData: true,
      iconError: (rowData) => (
        <button className="btn btn-link m-0 p-0" type="button">
          <i
            className="bi bi-bootstrap-reboot"
            style={{ color: "orange", fontSize: "20px" }}
          ></i>
        </button>
      ),
      iconSuccess: (rowData) => (
        <button
          className="btn btn-link"
          type="button"
          onClick={() => handleClickClose(rowData.SRL)} // Pass SRL here
        >
          <i
            className="bi bi-check2-circle"
            style={{ color: "green", fontSize: "20px" }}
          ></i>
        </button>
      ),
    },
    {
      headername: "Mahajon",
      fieldname: "Update_Mahajon_Voucher",
      type: "number",
      isReadOnly: true,
      isShortingOff: true,
      isIconicData: true,
      iconError: (rowData) => (
        <></>
      ),
      iconSuccess: (rowData) => (
        <button
          className="btn btn-link"
          type="button"
          onClick={() => handleClickClose(rowData.SRL)} // Pass SRL here
        >
          <i
            className="bi bi-check2-circle"
            style={{ color: "red", fontSize: "20px" }}
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
      </div>
      <div className="d-flex justify-content-end mt-1">
        <button
          className="btn btn-success py-1 px-2"
          type="button"
          onClick={handleAdd}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
      <div>
        {params?.isAdd && (
          <AddItem
            newRow={newRow}
            params={params}
            setParams={setParams}
            headerData={headerData}
            entityType={entityType}
            trancode={trancode}
            headerid={id}
            lotno={lotno}
            lastSrl={Number.parseFloat(lastSrl)}
          />
        )}
      </div>
      <>
        {/* <Modal/> */}
        <ReusableModal
          show={params?.view}
          handleClose={handleClose}
          isFullScreen={true}
          body={
            <PrincipalEntryView
              id={selectedId}
              lotno={lotno}
              SRL={params?.SRL}
              HandleClose={handleClose}
              entityType={entityType}
              trancode={trancode}
              Valuation={params.Valuation}
              headerEntryDate={headerData?.EntryDate || user?.date}
            />
          }
          Title={`${
            trancode === "0RC" || trancode === "0RW" ? "Opening" : "Recive/Dafa"
          } Principal Detail View`}
          isPrimary={true}
          handlePrimary={handleClose}
          PrimaryButtonName={"Close"}
        />
      </>
    </div>
  );
}

export default OpeningEntryDetailTable;
