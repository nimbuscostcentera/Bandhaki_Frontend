"use client";

import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./ledger.css";
import { toast, ToastContainer } from "react-toastify";

import { Row, Col, Container } from "react-bootstrap";
import Table from "../../Component/Table";
import BongDatePicker from "../../Component/BongDatePicker";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown/index";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
// import useFetchFineHeader from "../../store/ShowStore/useFetchMetalReturnView";
import useFetchCust from "../../store/ShowStore/useFetchCust"; // Assuming you have these hooks
import useFetchWS from "../../store/ShowStore/useFetchWS"; // Assuming you have these hooks
import useFetchLedgerView from "../../store/ShowStore/useFetchLedgerView";

function LedgerView() {
  //---------other state-------

  // const location = useLocation();
  // const { custId, customertype } = location?.state || {};

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get("type") === "customer" ? 1 : 2;
  // entityType = customertype === undefined ? entityType : customertype ;
  // console.log(entityType, "entityType");
  // console.log(customertype, "customertype");
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
  });
  const [textDetail, setTextDetail] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    viewStartDatePicker: false,
    viewEndDatePicker: false,
  });

  // const [entityTypeSelection, setEntityTypeSelection] = useState(entityType);
  const [viewType, setViewType] = useState(1); // Default to summary
  const [customer, setCustomer] = useState([]);
  const [wholeseller, setWholeseller] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState(-1);
  const [Total, setTotal] = useState({
    DuePrn: 0,
    DueInt: 0,
    IntCr: 0,
    IntDr: 0,
    PrnCr: 0,
    PrnDr:0
  });
  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  const { isAdjustDetailError } = useFetchAdjustDetailReport();
  const {
    LedgerViewList,
    isLedgerViewListLoading,
    isLedgerViewListError,
    ClearstateLedgerViewList,
    fetchLedgerViewHeader,
    searchLedgerViewHeader,
  } = useFetchLedgerView();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();

  //--------------------------function call-----------------------------

  //edit input handler
  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };
  //sorting
  // const SortingFunc = (header, type) => {
  //   if (!filteredData || filteredData.length === 0) return;
  //   let currentOrder = "";
  //   let isAsc = false;
  //   let isDesc = false;
  //   if (type == "time") {
  //     for (let i = 0; i < filteredData.length - 1; i++) {
  //       const a = Number.parseInt(
  //         (filteredData[i]?.[header]).toString().replace(/:/g, ""),
  //         10
  //       );
  //       const b = Number.parseInt(
  //         (filteredData[i + 1]?.[header]).toString().replace(/:/g, ""),
  //         10
  //       );
  //       if (a > b) {
  //         isAsc = true;
  //       }
  //       if (b > a) {
  //         isDesc = true;
  //       }
  //     }
  //     if (isAsc) {
  //       currentOrder = "Desc";
  //     }
  //     if (isDesc) {
  //       currentOrder = "Asc";
  //     }
  //   } else {
  //     currentOrder = checkOrder(filteredData, header);
  //   }
  //   const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

  //   let result;
  //   if (type === "String") {
  //     result = SortArrayByString(newOrder, filteredData, header);
  //   } else if (type === "Date") {
  //     result = SortArrayByDate(newOrder, filteredData, header);
  //   } else if (type === "number") {
  //     result = SortArrayByNumber(newOrder, filteredData, header);
  //   } else if (type == "BongDate") {
  //     result = BongDateSorting(newOrder, filteredData, header);
  //   } else if (type == "time") {
  //     result = SortArrayByTime(newOrder, filteredData, header);
  //   }

  //   setFilteredData(result);
  //   setOriginalOrder(result.map((row) => row.ID));
  // };

  // Search functionality
  // Modified performSearch to only handle API calls
  const performSearch = () => {
    console.log("hello 3")
    // Clear previous data
    setFilteredData([]);
    ClearstateLedgerViewList();

 

    fetchLedgerViewHeader({
      CustomerID: selectedEntityId,
      CompanyID: user?.CompanyID,
      Cust_Type: entityType,
      ViewType: viewType,
      StartDate: Filters?.StartDate,
      EndDate: Filters?.EndDate,
    });
  };

  // // 4. Update handleGoClick to force refresh
  // const handleGoClick = () => {
  //   performSearch();
  // };
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

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntityId(value);
  };

  //--------------------------useEffects-----------------------------

  // Add this useEffect to fetch data when entityTypeSelection changes
  useEffect(() => {
    if (entityType == 1) {
      fetchCustomrData({ CompanyID: user?.CompanyID });
    } else {
      fetchWSomrData({ CompanyID: user?.CompanyID });
    }
    setSelectedEntityId(-1);
    setFilteredData([]);
  }, [entityType, user?.CompanyID]);
  // console.log(entityType, "entityTypeSelection");

  useEffect(() => {
    if (CustomerList?.length > 0) {
      const formattedCustomers = CustomerList.map((customer) => ({
        label: customer.Name,
        value: customer.ID,
      }));
      setCustomer(formattedCustomers);
    }
  }, [CustomerList]);

  useEffect(() => {
    if (WholeSellerList?.length > 0) {
      const formattedWholesellers = WholeSellerList.map((wholeseller) => ({
        label: wholeseller.Name,
        value: wholeseller.ID,
      }));
      setWholeseller(formattedWholesellers);
    }
  }, [WholeSellerList]);

  // 3. Modify useEffect dependencies (remove viewType)
  useEffect(() => {
    toast.dismiss();
    // console.log(
    //   viewType,
    //   selectedEntityId !== -1,
    //   Filters?.StartDate && Filters?.EndDate,
    //   searchTerm.trim() !== ""
    // );
    if (
      selectedEntityId !== -1 ||
      (Filters?.StartDate && Filters?.EndDate) ||
      searchTerm.trim() !== "" ||
      viewType
    ) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      return;
    }
  }, [searchTerm, Filters?.StartDate, Filters?.EndDate, selectedEntityId,viewType]);
  // Reset state when entityType changes
  useEffect(() => {
    setFilteredData([]);
    setSearchTerm("");
    // setSearchDate("");
    ClearstateLedgerViewList();
    // Trigger initial API call for new entityType
    // performSearch();
  }, [entityType]);
  // Update filtered data when EntryList changes
  // Update filtered data when API response comes
  useEffect(() => {
    if (isLedgerViewListError) {
      setFilteredData([]);
    } else if (LedgerViewList.length > 0) {
      const updatedList =
        viewType === 1
          ? LedgerViewList.map(processSummaryData)
          : LedgerViewList;

      if (viewType !== 1) {
        // Initialize accumulator with all required properties set to 0
        const initialTotal = {
          PrnCr: 0,
          PrnDr: 0,
          DuePrn: 0,
          IntCr: 0,
          IntDr: 0,
          DueInt: 0,
        };

        const obj = updatedList.reduce((acc, item) => {
          // Parse values with fallback to 0 if invalid/undefined
          const principalDR = Number.parseFloat(item.Principal_DR) || 0;
          const principalCR = Number.parseFloat(item.Principal_CR) || 0;
          const intDR = Number.parseFloat(item.Int_DR) || 0;
          const intCR = Number.parseFloat(item.Int_CR) || 0;

          acc.PrnCr += principalCR;
          acc.PrnDr += principalDR;
          acc.DuePrn += principalDR - principalCR;
          acc.IntCr += intCR;
          acc.IntDr += intDR;
          acc.DueInt += intDR - intCR;

          return acc;
        }, initialTotal); // Initialize with properly structured object

        console.log("Calculated Totals:", obj);
        setTotal(obj);
      }
      setFilteredData(updatedList);
    }
  }, [LedgerViewList, viewType, isLedgerViewListError]);


  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setFilters({ StartDate: null, EndDate: null });
      setTextDetail("");
      setFilteredData([]);
      setOriginalOrder([]);
      setEditedData({});
      setSearchTerm("");
      setParams({ viewStartDatePicker: false, viewEndDatePicker: false });
      setViewType(1);
      setCustomer([]);
      setWholeseller([]);
      setSelectedEntityId(-1);
      ClearstateLedgerViewList(); // Clear API-related store state
    };
  }, []);

  // Helper function for summary data processing
  const processSummaryData = (item) => ({
    ...item,
    TotalPrincipalDR: item.TotalPrincipalDR || 0,
    TotalPrincipalCR: item.TotalPrincipalCR || 0,
    TotalIntDR: item.TotalIntDR || 0,
    TotalIntCR: item.TotalIntCR || 0,
  });
  //-------------------------variables call-----------------------------

  const columns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "String",
      width: "75px",
    },
    {
      headername: "Lot No",
      fieldname: "LotNo",
      type: "String",
      width: "92px",
    },
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "String",
      width: "50px",
    },
    {
      headername: "SRL_Prn",
      fieldname: "SRL_Prn",
      type: "String",
      width: "65px",
    },
    {
      headername: "Start Date",
      fieldname: "StartDate",
      type: "BongDate",
      width: "75px",
    },
    {
      headername: "End Date",
      fieldname: "EndDate",
      type: "BongDate",
      width: "75px",
    },
    {
      headername: "Interface",
      fieldname: "Interface",
      type: "String",
      width: "160px",
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "170px",
    },
    {
      headername: "Prn_DR",
      fieldname: "Principal_DR",
      type: "number",
      width: "65px",
    },
    {
      headername: "Prn_CR",
      fieldname: "Principal_CR",
      type: "number",
      width: "65px",
    },
    {
      headername: "Int_DR",
      fieldname: "Int_DR",
      type: "number",
      width: "65px",
    },
    {
      headername: "Int_CR",
      fieldname: "Int_CR",
      type: "number",
      width: "65px",
    },
    // {
    //   headername: "Cust. Name",
    //   fieldname: "CustomerName",
    //   type: "String",
    // width: "200px",
    // },
  ];
  const summaryColumns = [
    {
      headername: "Lot No",
      fieldname: "LotNo",
      type: "String",
    },
    {
      headername: "SRL",
      fieldname: "SRL",
      type: "String",
      width: "50px",
    },
    {
      headername: "SRL_Prn",
      fieldname: "SRL_Prn",
      type: "String",
      width: "50px",
    },
    {
      headername: "Total Principal DR",
      fieldname: "Principal_DR",
      type: "number",
      width: "150px",
    },
    {
      headername: "Total Principal CR",
      fieldname: "Principal_CR",
      type: "number",
      width: "150px",
    },
    {
      headername: "Total Interest DR",
      fieldname: "Int_DR",
      type: "number",
      width: "150px",
    },
    {
      headername: "Total Interest CR",
      fieldname: "Int_CR",
      type: "number",
      width: "150px",
    },
    {
      headername: "Customer Name",
      fieldname: "CustomerName",
      type: "String",
      width: "200px",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div
            className="d-flex align-items-center justify-content-between flex-wrap gap-3 my-2"
            style={{ rowGap: "10px" }}
          >
            <div>
              <h5
                className="mt-2 mb-0"
                style={{ fontSize: "18px", whiteSpace: "nowrap" }}
              >
                Ledger View for {entityType == 1 ? " Customer" : " WholeSeller"}
              </h5>
            </div>

            <div
              className="d-flex align-items-center flex-wrap gap-3"
              style={{ flex: "1", justifyContent: "flex-end", flexShrink: 1 }}
            >
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

              <div style={{ width: "220px", minWidth: "180px" }}>
                <SearchableDropDown
                  options={entityType == 1 ? customer : wholeseller}
                  handleChange={handleHeaderChange}
                  selectedVal={selectedEntityId}
                  label={"selectedEntityId"}
                  placeholder={
                    entityType == 1
                      ? "--Select Customer--"
                      : "--Select Wholeseller--"
                  }
                  key={entityType}
                  defaultval={-1}
                  width={"100%"}
                />
              </div>

              <SelectOption
                OnSelect={(e) => {
                  setViewType(e?.target?.value);
                  setFilteredData([]);
                  ClearstateLedgerViewList();
                }}
                SelectStyle={{
                  width: "150px",
                  padding: "7px 8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
                PlaceHolder={"--Select View--"}
                SName={"ViewType"}
                Value={viewType}
                Soptions={[
                  { Name: "Summary", Value: 1 },
                  { Name: "Detail", Value: 2 },
                ]}
              />
            </div>
          </div>

          <hr className="my-1" />
        </Col>
        {/* Form Fields */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          {/* Detail View Input */}
          <textarea
            value={textDetail}
            readOnly
            type="search"
            placeholder="Detail View"
            style={{
              width: "100%",
              border: "2px solid #ced4da",
              borderRadius: "8px",
              padding: "5px 8px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#212529",
              transition: "all 0.3s ease",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              "::placeholder": {
                color: "#868e96",
                opacity: " 1",
                fontWeight: "300",
              },
              // Focus state
              ":focus": {
                borderColor: "#3b7ddd",
                boxShadow: "0 0 0 3px rgba(59, 125, 221, 0.25)",
                backgroundColor: "#f8fbff",
              },
            }}
          />
        </Col>
        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{height: "calc(100vh - 200px)"}}>         
            {filteredData?.length > 0 ? (
              viewType == 1 ? (
                <Table
                  Col={summaryColumns}
                  OnChangeHandler={OnChangeHandler}
                  tab={filteredData || []}
                  isLoading={isLedgerViewListLoading}
                  getFocusText={(val) => {
                    setTextDetail(val);
                  }}
                  showScrollButtons={true}
                />
              ) : (
                <Table
                  Col={columns}
                  OnChangeHandler={OnChangeHandler}
                  tab={filteredData || []}
                  isLoading={isLedgerViewListLoading}
                  getFocusText={(val) => {
                    setTextDetail(val);
                  }}
                  FooterBody={
                    <tr
                      className="td-class"
                      style={{
                        zIndex: 2,
                        position: "sticky",
                        bottom: "0",
                      }}
                    >
                      <td>
                        <i className="bi bi-calculator"></i>
                      </td>
                      <td colSpan={1}>Due Prn Amt. </td>
                      <td colSpan={2}>{Math.abs(Total?.DuePrn)}</td>
                      <td>-</td>
                      <td colSpan={1}>Due Int Amt. </td>
                      <td colSpan={2}>{Math.abs(Total?.DueInt)}</td>
                      <td>Total</td>
                      <td>{Total?.PrnDr}</td>
                      <td>{Total?.PrnCr}</td>
                      <td>{Total?.IntDr}</td>
                      <td>{Total?.IntCr}</td>
                    </tr>
                  }
                  height={"65vh"}
                  isFooter={true}
                  showScrollButtons={true}
                />
              )
            ) : isLedgerViewListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                {isLedgerViewListError
                  ? "No results found . "
                  : "Use the filters to find ledger data."}
              </div>
            )}
        </Col>
      </Row>
    </Container>
  );
}

export default LedgerView;
