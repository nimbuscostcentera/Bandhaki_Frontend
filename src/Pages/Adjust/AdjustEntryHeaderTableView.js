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
import { ToastContainer } from "react-toastify";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";

function AdjustEntryHeaderTableView() {
  //---------other state-------

  const location = useLocation();
  const { custId, customertype } = location?.state || {};

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  let entityType = searchParams.get("type") === "customer" ? 1 : 2;
  entityType = customertype ? customertype : entityType;

  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState(false);
  const [initialCustId, setInitialCustId] = useState(custId || -1);
  const [searchDate, setSearchDate] = useState("");
  const [view, setView] = useState(false);

  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  const { isAdjustDetailError } = useFetchAdjustDetailReport();
  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();
  const {
    AdjustEntryList,
    isAdjustEntryListLoading,
    isAdjustEntryListError,
    ClearstateAdjustEntryList,
    fetchAdjustEntryHeader,
    searchAdjustEntryHeader,
  } = useFetchAdjustEntryHeader();

  //--------------------------api calls-----------------------------

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
    console.log(selectedData,"selectedData")
    setInitialCustId((prev)=>selectedData?.id_Customer);
    setSelectedId(selectedData.ID);
    setParams(true);
  };
  // Calendar handlers
  const handleShow = () => {
    setView(true);
  };
  // Calendar handlers
  const handleClose1 = () => {
    setView(false);
  };
  // Calendar handlers
  const handleSave1 = (BengaliDate, EnglishDate) => {
    setSearchDate(BengaliDate);
  };
  // Search functionality
  const performSearch = () => {
    if (
      custId !== undefined &&
      custId !== -1 &&
      custId !== null &&
      custId !== ""
    ) {
      fetchAdjustEntryHeader({
        CustomerID: custId||null,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
      });
    } else {
      searchAdjustEntryHeader({
        keyword: searchTerm.trim(),
        date: searchDate,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
      });
    }
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
      if (searchTerm.trim() || searchDate) {
        const debounceTimer = setTimeout(() => {
          performSearch();
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    }

  }, [searchDate, searchTerm, custId]);
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
  //finecode fetch
  useEffect(() => {
    fetchFineHeader({ CompanyID, Type: 1 });
  }, []);

  //-------------------------variables call-----------------------------
  const paymentMode = [
    { label: "Cash", Value: 1 },
    { label: "UPI", Value: 2 },
    { label: "Bank Transfer", Value: 3 },
  ];
  const columns = [
    {
      headername: "Customer",
      fieldname: "CustomerName",
      type: "String",
    },
    {
      headername: "Rcv Amt",
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
      headername: "Adjust Amt",
      fieldname: "Cust_Adjust_Amt",
      type: "number",
    },
    { headername: "Refund Amt", fieldname: "Ref_Amt", type: "number" },

    {
      headername: "Pay Mode(Refund)",
      fieldname: "paymentModeLabelrefamt",
      // fieldname: "paymentModeLabelrefamt",
      selectionname: "Ref_Amt_Mode",
      type: "String",
      max: 100,
      width: 135,
      isSelection: true,
      options: paymentMode,
    },
    {
      headername: "Balance Amt",
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
  // Reset filteredData when entityType changes
  useEffect(() => {
    setFilteredData(()=> []);
    setSearchTerm("");
    setSearchDate("");
     ClearstateAdjustEntryList();
  }, [entityType]);
  console.log(initialCustId)
  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2">
                Adjust Entry View for{" "}
                {entityType == 1 ? "Customer" : "WholeSeller"}
              </h5>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        {/* Form Fields */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
          <Row>
            <Col xs={12} sm={12} md={12} lg={7}>
              <div className="d-flex align-items-center justify-content-center text-nowrap">
                {/* Date Picker */}
                <label>Search By Date &nbsp;&nbsp;</label>
                <Form.Group className="me-3 mt-2">
                  <InputBox
                    type="date"
                    placeholder="Date"
                    label="date"
                    Name="date"
                    onChange={(e) => setSearchDate(e.target.value)}
                    Icon={<i className="bi bi-calendar"></i>}
                    SearchButton={true}
                    SearchIcon={<i className="bi bi-calendar fs-5"></i>}
                    SearchHandler={handleShow}
                    maxlen={100}
                    value={searchDate || ""}
                    isfrontIconOff={true}
                    InputStyle={{ padding: "8px" }}
                    isdisable
                  />
                  <BongCalender
                    view={view}
                    handleclose={handleClose1}
                    handleSave={handleSave1}
                  />
                </Form.Group>

                {/* Search Input */}
                <InputGroup className="mt-2">
                  <Form.Control
                    autoFocus
                    placeholder="Search..."
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    style={{ width: "250px", zIndex: "1" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={performSearch}
                  >
                    <i className="bi bi-search"></i>
                  </Button> */}
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Col>
        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div
            className="table-box"
            style={{ height: "65vh", border: "1px solid lightgrey" }}
          >
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
              />
            ) : isAdjustEntryListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                {searchTerm || searchDate
                  ? "No results found. Try a different search."
                  : "Use the search bar or date picker to find entries."}
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
    </Container>
  );
}

export default AdjustEntryHeaderTableView;
