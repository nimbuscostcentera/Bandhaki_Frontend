import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer } from "react-toastify";

import { Row, Col, Form, Container, InputGroup } from "react-bootstrap";
import Table from "../../Component/Table";
import BongDatePicker from "../../Component/BongDatePicker";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
// import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
import useFetchMetalReturnView from "../../store/ShowStore/useFetchMetalReturnView";

function MetalReturnView() {
  //---------other state-------

  const location = useLocation();
  const { custId, customertype, lotNo, srl } = location?.state || {};
  console.log(custId, customertype, lotNo,srl,"1","2");

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  let entityType =
    searchParams.get("type") === "customer"
      ? 1
      : searchParams.get("type") === "wholeseller"
      ? 2
      : 3;
  entityType = customertype ? customertype : entityType;
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate:null,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    viewStartDatePicker: false,
    viewEndDatePicker: false,
  });
  const [initialCustId, setInitialCustId] = useState(custId || -1);
  const [searchDate, setSearchDate] = useState("");

  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  const { isAdjustDetailError } = useFetchAdjustDetailReport();

  const {
    MetalReturnList,
    isMetalReturnListLoading,
    isMetalReturnListError,
    ClearstateMetalReturnList,
    fetchMetalReturnHeader,
    searchMetalReturnHeader,
  } = useFetchMetalReturnView();

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
        const a = Number.parseInt(
          (filteredData[i]?.[header]).toString().replace(/:/g, ""),
          10
        );
        const b = Number.parseInt(
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

  // Search functionality
  const performSearch = () => {
    if (
      custId !== undefined &&
      custId !== -1 &&
      custId !== null &&
      custId !== ""
    ) {
      fetchMetalReturnHeader({
        CustomerID: custId || null,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        LotNo: lotNo || null,
        SRL: srl || null,
        ...Filters,
      });
    }
    else if (
      (searchTerm !== "" && searchTerm !== null && searchTerm !== undefined) ||
      (searchDate !== "" && searchDate !== null && searchDate !== undefined)
    ) {
      searchMetalReturnHeader({
        keyword: searchTerm.trim(),
        date: searchDate,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        lotNo: lotNo,
        srl: srl,
        ...Filters,
      });
    }
  };
  const HandleCloseDatePicker = () => {
    setParams({
      viewStartDatePicker: false,
      viewEndDatePicker: false,
    });
  };
  const HandleOpenStartDatePicker = () => {
    setParams({
      viewStartDatePicker: true,
      viewEndDatePicker: false,
    });
    return;
  };

  const HandleOpenEndDatePicker = () => {
    setParams({
      viewStartDatePicker: false,
      viewEndDatePicker: true,
    });
    return;
  };
  const FilterHandler = (e, key) => {
    console.log(e, key);
    setFilters({ ...Filters, [key]: e });
  };

  //--------------------------useEffects-----------------------------

  // Modified data fetch useEffect
  useEffect(() => {
   
    if (custId) {
      performSearch();
    }
    else
    {
      if (
        (searchTerm !== "" &&
          searchTerm !== undefined &&
          searchTerm !== null &&
          searchDate !== "" &&
          searchDate !== null &&
          searchDate !== undefined) ||
        (Filters?.StartDate && Filters?.EndDate) ||
        (!Filters?.StartDate && !Filters?.EndDate)
      ) {
        console.log(
          searchTerm,
          searchDate,
          custId,
          entityType,
          Filters?.StartDate,
          Filters?.EndDate
        );
        const debounceTimer = setTimeout(() => {
          performSearch();
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    }
  }, [searchDate, searchTerm, custId, entityType, Filters?.StartDate, Filters?.EndDate]);
  
  
  // Reset state when entityType changes
  useEffect(() => {
    setFilteredData([]);
    setSearchTerm("");
    setSearchDate("");
    ClearstateMetalReturnList();
    // Trigger initial API call for new entityType
    performSearch();
  }, [entityType]);
  // Update filtered data when EntryList changes
  useEffect(() => {
    if (isMetalReturnListError) {
      setFilteredData([]);
    } else {
      const updatedList = MetalReturnList.map((item) => {
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
    MetalReturnList,
    custId,
    searchDate,
    searchTerm,
    isMetalReturnListLoading,
    isAdjustDetailError,
    isMetalReturnListError,
    Filters?.EndDate,
    Filters?.StartDate,
  ]);
  //-------------------------variables call-----------------------------
  const paymentMode = [
    { label: "Cash", Value: 1 },
    { label: "Bank Transfer", Value: 2 },
    { label: "UPI", Value: 3 },
    { label: "Adjust", Value: 4 },
  ];
  const columns = [
    {
      headername: "ID",
      fieldname: "ID",
      type: "String",
    },
    {
      headername: "Customer",
      fieldname: "CustomerName",
      type: "String",
    },
    {
      headername: "Lot No",
      fieldname: "LotNo",
      type: "String",
    },
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "String",
    },
    {
      headername: "Date",
      fieldname: "Date",
      type: "BongDate",
    },
    {
      headername: "Total Prn Rcv",
      fieldname: "Total_Prn_Rcv",
      type: "number",
    },
    {
      headername: "Total Prn Paid",
      fieldname: "Total_Prn_paid",
      type: "number",
    },
    {
      headername: "Total Int Paid",
      fieldname: "Total_Int_Paid",
      type: "number",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap my-2">
            <div>
              <h5 className="mt-2">
                View Return Metal
                {entityType == 1
                  ? " to Customer"
                  : entityType == 2
                  ? " to  Wholesaler"
                  : " from  Mahajon"}
              </h5>
            </div>
            <div className="d-flex align-items-center justify-content-center text-nowrap">
              <BongDatePicker
                handleClose={HandleCloseDatePicker}
                handleOpenStartDate={HandleOpenStartDatePicker}
                handleOpenEndDate={HandleOpenEndDatePicker}
                handleChange={FilterHandler}
                view1={params?.viewStartDatePicker}
                view2={params?.viewEndDatePicker}
                startDate={Filters?.StartDate}
                endDate={Filters?.EndDate}
              />

              <InputGroup className="mx-3">
                <Form.Control
                  autoFocus
                  placeholder="Search..."
                  aria-label="search"
                  aria-describedby="basic-addon1"
                  style={{ zIndex: "1", padding: "5px 10px", width: "30vw" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        {/* Form Fields */}
        {/* <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className="d-flex align-items-center justify-content-center text-nowrap">
                {/* Date Picker 
                <label>Date Range &nbsp;&nbsp;</label>
                {/* <Form.Group className="me-3 mt-2">
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
                <BongDatePicker />
                {/* Search Input 
                <InputGroup className="mx-3">
                  <Form.Control
                    autoFocus
                    placeholder="Search..."
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    style={{ zIndex: "1", padding: "5px 10px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={performSearch}
                  >
                    <i className="bi bi-search"></i>
                  </Button> 
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Col> */}
        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="table-box">
            {filteredData?.length > 0 ? (
              <Table
                Col={columns}
                onSorting={SortingFunc}
                OnChangeHandler={OnChangeHandler}
                tab={filteredData || []}
                isLoading={isMetalReturnListLoading}
                height={"80%"}
                // isView={true}
                // handleViewClick={handleViewClick}
                // EditedData={editedData}
              />
            ) : isMetalReturnListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25" style={{height:"70vh"}}>
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
    </Container>
  );
}

export default MetalReturnView;
