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
// import AdjustEntryDetailTableView from "./AdjustEntryDetailTableView";
import { useLocation, useSearchParams } from "react-router-dom";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";
import { ToastContainer } from "react-toastify";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
import BongDatePicker from "../../Component/BongDatePicker";
import useFetchDueRcvWhView from "../../store/ShowStore/useFetchDueRcvWhView";

function Duerecwhview() {
  //---------other state-------
  const location = useLocation();
  const { custId, customertype } = location?.state || {};

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  let entityType = searchParams.get("type") === "customer" ? 1 : 2;
  entityType = customertype ? customertype : entityType;
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

  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  const { isAdjustDetailError } = useFetchAdjustDetailReport();

  const {
    DueRcvWhViewList,
    isDueRcvWhViewListLoading,
    isDueRcvWhViewListError,
    ClearstateDueRcvWhViewList,
    searchDueRcvWhViewHeader,
    // DueRcvWhViewErrMsg,
  } = useFetchDueRcvWhView();
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

      searchDueRcvWhViewHeader({
        keyword: searchTerm.trim(),
        date: searchDate,
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        StartDate: Filters?.StartDate,
        EndDate: Filters?.EndDate,
      });
    
  };

  //--------------------------useEffects-----------------------------

  // Modified data fetch useEffect
    useEffect(() => {
      console.log(searchTerm,"searchTerm");

      if (searchTerm === "" && !searchDate) {
          setFilteredData([]);
          performSearch();
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
    
  }, [searchDate, searchTerm, Filters]);
  //debouncing
  useEffect(() => {
    if (isAdjustDetailError) {
      ClearstateDueRcvWhViewList();
      performSearch();
    }
  }, [isAdjustDetailError]);
  // Update filtered data when EntryList changes
  useEffect(() => {
    if (isDueRcvWhViewListError) {
      setFilteredData([]);
    } else {
      const updatedList = DueRcvWhViewList.map((item) => {
        const mode = paymentMode.find(
          (mode) => mode.Value == item.Payment_Mode
        );
        return {
            ...item,
            Payment_Mode: mode?.label,
       
        };
      });
      if (searchDate || searchTerm || initialCustId ) {
        setFilteredData(updatedList);
      }
      }
      
    if (!searchDate && !searchTerm && !initialCustId ) {
      setFilteredData([]);
    }
  }, [
    DueRcvWhViewList,
    searchDate,
    searchTerm,
    isDueRcvWhViewListLoading,
    isAdjustDetailError,
    isDueRcvWhViewListError,
  ]);
  // Reset filteredData when entityType changes
  useEffect(() => {
    setFilteredData(() => []);
    setSearchTerm("");
    setSearchDate("");
    ClearstateDueRcvWhViewList();
  }, [entityType]);
  //-------------------------variables call-----------------------------
  const paymentMode = [
    { label: "Cash", Value: 1 },
    { label: "UPI", Value: 2 },
    { label: "Bank Transfer", Value: 3 },
  ];
  const columns = [
    {
      headername: "Wholesaler Name",
      fieldname: "Wholesaler_Name",
      type: "String",
    },
    {
      headername: "Due Amount",
      fieldname: "Due_Amount",
      type: "number",
    },
    {
      headername: "Paid Amount",
      fieldname: "Paid_Amount",
      type: "number",
      //   max: 100,
      //   width: 135,
    },
    {
      headername: "Payment Mode",
      fieldname: "Payment_Mode",
      type: "String",
      //   max: 100,
      //   width: 135,
    },
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "BongDate",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2" style={{ fontSize: "18px" }}>
                Due Rcv. For Wholesaler
              </h5>
            </div>
            <div className="d-flex justify-content-between flex-wrap align-items-end">
              <div>
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
              </div>
              <div className="mt-1 mb-0">
                <InputGroup>
                  <Form.Control
                    autoFocus
                    placeholder="Search..."
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    style={{ width: "340px", zIndex: "1", padding: "3px 5px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div
            className="table-box"
            style={{ height: "55vh", border: "1px solid lightgrey" }}
          >
            {filteredData?.length > 0 ? (
              <Table
                Col={columns}
                onSorting={SortingFunc}
                OnChangeHandler={OnChangeHandler}
                tab={filteredData || []}
                isLoading={isDueRcvWhViewListLoading}
                // isView={true}
                // handleViewClick={handleViewClick}
                // EditedData={editedData}
              />
            ) : isDueRcvWhViewListLoading ? (
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
    </Container>
  );
}

export default Duerecwhview;
