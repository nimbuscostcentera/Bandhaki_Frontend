import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { Row, Col, Form, Container, InputGroup, Button } from "react-bootstrap";
import InputBox from "../../Component/InputBox";
import BongCalender from "../../Component/BongCalender";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import Table from "../../Component/Table";
import ReusableModal from "../../Component/ReusableModal";
import useFetchAdjustEntryHeader from "../../store/ShowStore/useFetchAdjustEntryHeader";
import AdjustEntryDetailTableView from "./AdjustEntryDetailTableView";
import { useLocation, useSearchParams } from "react-router-dom";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";
import { toast, ToastContainer } from "react-toastify";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
import BongDatePicker from "../../Component/BongDatePicker";
import useAdjustVouDelete from "../../store/DeleteStore/useAdjustVoucherDelete";
import useAdjustDeleteCheck from "../../store/Checker/useAdjustDeleteCheck";
import DeleteConfirmation from "../../Component/ReusableDelete";

function AdjustEntryHeaderTableView() {
  //---------other state-------
  const location = useLocation();
  const { custId, customertype, trancode } = location?.state || {};

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  let entityType =
    searchParams.get("type") === "customer"
      ? 1
      : searchParams.get("type") === "wholeseller"
      ? 2
      : 3;
  entityType = customertype ? customertype : entityType;

  let Trancode = searchParams.get("trancode");

  Trancode = trancode ? trancode : Trancode;
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState(false);
  const [initialCustId, setInitialCustId] = useState(custId || -1);
  const [searchDate, setSearchDate] = useState("");
  const [view, setView] = useState({
    View1: false,
    View2: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  const { isAdjustDetailError } = useFetchAdjustDetailReport();
  const {
    AdjustEntryList,
    isAdjustEntryListLoading,
    isAdjustEntryListError,
    ClearstateAdjustEntryList,
    fetchAdjustEntryHeader,
    searchAdjustEntryHeader,
  } = useFetchAdjustEntryHeader();
  const {
    DeleteAdjustVou,
    ClearAdjustVouDelete,
    AdjustVouDeleteErr,
    isAdjustVouDeleteLoading,
    AdjustVouDeleteMsg,
  } = useAdjustVouDelete();

  const {
    CheckAdjustDeleteCheckMsg,
    isCheckAdjustDeleteCheck,
    isCheckAdjustDeleteCheckLoading,
    CheckAdjustDeleteCheckErr,
    ClearCheckAdjustDeleteCheck,
    CheckAdjustDeleteCheck,
  } = useAdjustDeleteCheck();
  //--------------------------function call-----------------------------

  //edit input handler
  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };
  //sorting
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
      if (isAsc) {
        currentOrder = "Desc";
      }
      if (isDesc) {
        currentOrder = "Asc";
      }
    } else {
      currentOrder = checkOrder(filteredData, header);
    }
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
    setOriginalOrder(result.map((row) => row.ID));
  };
  //detail view close
  const CloseHandler = () => {
    setParams(false);
  };
  //detail view Open
  const handleViewClick = (tabindex) => {
    const selectedData = filteredData[tabindex];
    // console.log(selectedData, "selectedData");
    setInitialCustId((prev) => selectedData?.id_Customer);
    setSelectedId(selectedData.ID);
    setParams(true);
  };
  // Calendar handlers
  const handleShow1 = () => {
    setView({ ...view, View1: true });
  };
  const handleShow2 = () => {
    setView({ ...view, View2: true });
  };
  const HandleInputDateRange = (val, name) => {
    setFilters({ ...Filters, [name]: val });
  };
  // Calendar handlers
  const handleClose = () => {
    setView({
      View1: false,
      View2: false,
    });
  };
  // Search functionality
  const performSearch = () => {
    if (
      custId !== undefined &&
      custId !== -1 &&
      custId !== null &&
      custId !== ""
    ) {
      console.log( "performSearch");
      fetchAdjustEntryHeader({
        CustomerID: custId || null,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        StartDate: Filters?.StartDate,
        EndDate: Filters?.EndDate,
      });
    } else {
      console.log("performSearch");
      searchAdjustEntryHeader({
        keyword: searchTerm.trim(),
        date: searchDate,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        StartDate: Filters?.StartDate,
        EndDate: Filters?.EndDate,
      });
    }
  };

  const handleDeleteClick = (index) => {
    const selectedObj = filteredData[index];
    console.log(selectedObj, "selectedObj");
    setInitialCustId((prev) => selectedObj?.id_Customer);
    if (!initialCustId) {
      return;
    }
    // console.log(initialCustId);
    CheckAdjustDeleteCheck({
      ID: selectedObj?.ID,
      TranCode: Trancode,
      Cust_Type: entityType,
    });
    setItemToDelete(selectedObj);
    //  setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteAdjustVou({
        ID: itemToDelete?.ID,
        // Cust_ID: initialCustId,
        TranCode: Trancode,
        Cust_Type: entityType,
      });
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  //--------------------------useEffects-----------------------------

  // Modified data fetch useEffect
  useEffect(() => {
    if (custId) {
      performSearch();
    } else {
      if (searchTerm === "" && !searchDate) {
        setFilteredData([]);
      }
      if (
        searchTerm.trim() ||
        searchDate ||
        (Filters?.StartDate && Filters?.EndDate)
      ) {
        const debounceTimer = setTimeout(() => {
          performSearch();
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    }
  }, [searchDate, searchTerm, custId, Filters]);




  //debouncing
  useEffect(() => {
    if (isAdjustDetailError) {
      ClearstateAdjustEntryList();
      performSearch();
    }
  }, [isAdjustDetailError]);
  // Update filtered data when EntryList changes
  useEffect(() => {
    if (isAdjustEntryListError) {
      setFilteredData([]);
    } else {
      const updatedList = AdjustEntryList.map((item) => {
        const mode = paymentMode.find(
          (mode) => mode.Value == item.Rcv_Amt_Mode
        );
        const mode1 = paymentMode.find(
          (mode) => mode.Value == item.Ref_Amt_Mode
        );
        return {
          ...item,
          Ref_Amt: item?.Ref_Amt == 0 ? "-" : item?.Ref_Amt,
          Ref_Amt_Mode: item?.Ref_Amt == 0 ? "-" : item?.Ref_Amt_Mode,
          Cust_Adjust_Amt:
            item?.Cust_Adjust_Amt == 0 ? "-" : item?.Cust_Adjust_Amt,
          Bal_Amt: item?.Bal_Amt == 0 ? "-" : item?.Bal_Amt,
          paymentModeLabelrcvamt: mode ? mode.label : "-", // Assign label if found, otherwise "Unknown"
          paymentModeLabelrefamt:
            mode1 && item?.Ref_Amt != 0 ? mode1.label : "-", // Assign label if found, otherwise "Unknown"
        };
      });
      if (searchDate || searchTerm || initialCustId || custId) {
        setFilteredData(updatedList);
      }
    }
    if (!searchDate && !searchTerm && !initialCustId && !custId) {
      setFilteredData([]);
    }
  }, [
    AdjustEntryList,
    custId,
    searchDate,
    searchTerm,
    isAdjustEntryListLoading,
    isAdjustDetailError,
    isAdjustEntryListError,
  ]);
  // Reset filteredData when entityType changes
  useEffect(() => {
    setFilteredData(() => []);
    setSearchTerm("");
    setSearchDate("");
    ClearstateAdjustEntryList();
  }, [entityType]);

  useEffect(() => {
    if (isCheckAdjustDeleteCheck == 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isCheckAdjustDeleteCheck === 2) {
      toast.dismiss();
      toast.warning(CheckAdjustDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckAdjustDeleteCheck();
  }, [isCheckAdjustDeleteCheckLoading, isCheckAdjustDeleteCheck]);

  useEffect(() => {
    if (AdjustVouDeleteMsg) {
      toast.success(AdjustVouDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (custId) {
      performSearch();
    } else {
      if (searchTerm === "" && !searchDate) {
        setFilteredData([]);
      }
      if (
        searchTerm.trim() ||
        searchDate ||
        (Filters?.StartDate && Filters?.EndDate)
      ) {
        const debounceTimer = setTimeout(() => {
          performSearch();
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    }
   
    if (AdjustVouDeleteErr) {
      toast.error(AdjustVouDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearAdjustVouDelete();
  }, [AdjustVouDeleteErr, isAdjustVouDeleteLoading, AdjustVouDeleteMsg]);
  //-------------------------variables call-----------------------------
  const paymentMode = [
    { label: "Cash", Value: 1 },
    { label: "Bank Transfer", Value: 2 },
    { label: "UPI", Value: 3 },
    { label: "Adjust", value: 4 },
  ];
  const columns = [
    {
      headername: "ID",
      fieldname: "ID",
      type: "number",
      width:"65px"
    },
    {
      headername: "Customer",
      fieldname: "CustomerName",
      type: "String",
    },
    {
      headername: "Rcv. Amt",
      fieldname: "Rcv_Amt",
      type: "number",
    },
    {
      headername: "Pay. Mode(Rcv)",
      fieldname: "paymentModeLabelrcvamt",
      selectionname: "Rcv_Amt_Mode",
      type: "String",
      max: 100,
      width: 135,
      isSelection: true,
      options: paymentMode,
    },
    {
      headername: "Adj. Amt",
      fieldname: "Cust_Adjust_Amt",
      type: "number",
    },
    { headername: "Ref. Amt", fieldname: "Ref_Amt", type: "number" },

    {
      headername: "Pay Mode(Ref)",
      fieldname: "paymentModeLabelrefamt",
      selectionname: "Ref_Amt_Mode",
      type: "String",
      max: 100,
      width: 135,
      isSelection: true,
      options: paymentMode,
    },
    {
      headername: "LotNo",
      fieldname: "LotNo",
      type: "String",
    },
    {
      headername: "LotPrnAmt",
      fieldname: "LotPrnAmount",
      type: "number",
    },

    {
      headername: "Disc. Amt",
      fieldname: "DiscountAmt",
      type: "number",
    },

    {
      headername: entityType == 3 ? "DebitAmt" : "CreditAmt",
      fieldname: "CreditAmt",
      type: "number",
    },
    {
      headername: "Bal. Amt",
      fieldname: "Bal_Amt",
      type: "number",
    },
    {
      headername: "Tans. Date",
      fieldname: "TransDate",
      type: "BongDate",
    },
    {
      headername: "Tans. Time",
      fieldname: "TransTime",
      type: "time",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2 ">
        <Col
          xl={4}
          lg={4}
          md={6}
          sm={12}
          xs={12}
          className="text-md-start text-sm-center"
        >
          <h5 className="mt-2">
            Adjusted Dafa of
            {entityType == 1
              ? " Customer"
              : entityType == 2
              ? " Wholesaler"
              : " Mahajon"}
          </h5>
        </Col>
        <Col xl={4} lg={5} md={6} sm={12} xs={12} className="my-2">
          <BongDatePicker
            view1={view?.View1}
            view2={view?.View2}
            endDate={Filters?.EndDate}
            startDate={Filters?.StartDate}
            handleChange={HandleInputDateRange}
            handleClose={handleClose}
            handleOpenEndDate={handleShow2}
            handleOpenStartDate={handleShow1}
          />
        </Col>
        <Col xl={4} lg={3} md={12} sm={12} xs={12} className="my-2">
          <InputGroup>
            <Form.Control
              autoFocus
              placeholder="Search..."
              aria-label="search"
              aria-describedby="basic-addon1"
              style={{ width: "100%", zIndex: "1", padding: "3px 5px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="table-box">
            {filteredData?.length > 0 ? (
              <Table
                Col={columns}
                onSorting={SortingFunc}
                OnChangeHandler={OnChangeHandler}
                tab={filteredData || []}
                isLoading={isAdjustEntryListLoading}
                isView={true}
                handleViewClick={handleViewClick}
                // EditedData={editedData}
                // handleDelete={handleDelete}
                isDelete={true}
                handleDelete={handleDeleteClick}
                height={"75vh"}
              />
            ) : isAdjustEntryListLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div
                style={{ height: "80vh" }}
                className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25"
              >
                <div className="text-muted">
                  {searchTerm || searchDate
                    ? "No results found. Try a different search."
                    : "Use the search bar or date picker to find entries."}
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
      {/* Modal */}
      <ReusableModal
        show={params}
        handleClose={CloseHandler}
        body={
          <AdjustEntryDetailTableView
            id={selectedId}
            CustomerID={initialCustId || -1}
            handleClose={CloseHandler}
            entityType={entityType}
          />
        }
        Title={"Adjust Entry Detail View"}
        isPrimary={true}
        handlePrimary={CloseHandler}
        PrimaryButtonName={"Close"}
      />
      <DeleteConfirmation
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Container>
  );
}

export default AdjustEntryHeaderTableView;
