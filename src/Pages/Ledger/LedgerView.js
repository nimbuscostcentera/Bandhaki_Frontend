"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./ledger.css";
import { toast, ToastContainer } from "react-toastify";
import getReports from "./getReports";

import { Row, Col, Container } from "react-bootstrap";
import Table from "../../Component/Table";
import BongDatePicker from "../../Component/BongDatePicker";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown/index";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
import useFetchCust from "../../store/ShowStore/useFetchCust";
import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchLedgerView from "../../store/ShowStore/useFetchLedgerView";

function LedgerView() {
  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  const entityType =
    searchParams.get("type") === "customer"
      ? 1
      : searchParams.get("type") === "wholeseller"
      ? 2
      : 3;
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
  });
  const [textDetail, setTextDetail] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [advanceData, setAdvanceData] = useState([]);
  const [outstandingData, setOutstandingData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    viewStartDatePicker: false,
    viewEndDatePicker: false,
    SearchFor:""
  });

  const [viewType, setViewType] = useState(1);
  const [customer, setCustomer] = useState([]);
  const [wholeseller, setWholeseller] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState(-1);
  const [Total, setTotal] = useState({
    DuePrn: 0,
    DueInt: 0,
    IntCr: 0,
    IntDr: 0,
    PrnCr: 0,
    PrnDr: 0,
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
    AdvanceReport,
    OutstandingReport,
  } = useFetchLedgerView();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();
  const { MahajonList, fetchMahajonData, isLoadingMahajon } = useFetchMahajon();

  //--------------------------function call-----------------------------


    // Calculate net balance
    const calculateNetBalance = useMemo(() => {
      try {
        let drAdjustments = 0;
        let crAdjustments = 0;

        // Safely process advance and outstanding data
        const processData = (data) => {
          if (!Array.isArray(data)) return;
          data.forEach((item) => {
            drAdjustments += parseFloat(item?.DR_Amt) || 0;
            crAdjustments += parseFloat(item?.CR_Amt) || 0;
          });
        };

        processData(advanceData);
        processData(outstandingData);

        // Safely get due amounts with fallbacks
        const duePrn = Math.abs(parseFloat(Total?.DuePrn)) || 0;
        const dueInt = Math.abs(parseFloat(Total?.DueInt)) || 0;

        // Calculate net amount with NaN prevention
        const netAmount = Number.isFinite(
          crAdjustments - (duePrn + dueInt + drAdjustments)
        )
          ? crAdjustments - (duePrn + dueInt + drAdjustments)
          : 0;
        console.log(crAdjustments, drAdjustments, duePrn, dueInt, netAmount, "balance");

        return {
          amount: Math.abs(netAmount),
          type: netAmount >= 0 && entityType == 3 ? "Debit" : netAmount >= 0 && (entityType == 1 || entityType == 2) ? "Credit" : 
          netAmount < 0 && entityType == 3 ? "Debit":"Credit",
        };
      } catch (error) {
        console.error("Error calculating net balance:", error);
        return {
          amount: 0,
          type: "Credit",
        };
      }
    }, [advanceData, outstandingData, Total]);
  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };

  const performSearch = () => {
    setFilteredData([]);
    setAdvanceData([]);
    setOutstandingData([]);
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
    setFilters({ ...Filters, [key]: e });
  };

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntityId(value);
  };

  //--------------------------useEffects-----------------------------
  useEffect(() => {
    if (entityType == 1) {
      fetchCustomrData({ CompanyID: user?.CompanyID });
    } else {
      fetchWSomrData({ CompanyID: user?.CompanyID });
    }
    setSelectedEntityId(-1);
    setFilteredData([]);
    setAdvanceData([]);
    setOutstandingData([]);
  }, [entityType, user?.CompanyID]);

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

  useEffect(() => {
    toast.dismiss();
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
    }
  }, [
    searchTerm,
    Filters?.StartDate,
    Filters?.EndDate,
    selectedEntityId,
    viewType,
  ]);

  useEffect(() => {
    setFilteredData([]);
    setAdvanceData([]);
    setOutstandingData([]);
    setSearchTerm("");
    ClearstateLedgerViewList();
  }, [entityType]);

  useEffect(() => {
    if (isLedgerViewListError) {
      setFilteredData([]);
      setAdvanceData([]);
      setOutstandingData([]);
    } else if (LedgerViewList.length > 0) {
      let updatedList =
        viewType === 1
          ? LedgerViewList.map(processSummaryData)
          : LedgerViewList;

      if (viewType !== 1) {
        const initialTotal = {
          PrnCr: 0,
          PrnDr: 0,
          DuePrn: 0,
          IntCr: 0,
          IntDr: 0,
          DueInt: 0,
        };

        updatedList = updatedList.map((item) => {
          const isPresentadvance = AdvanceReport?.some(
            (reportItem) => reportItem.Header_ID === item.Header_ID
          );
          const isPresentoutstanding = OutstandingReport?.some(
            (reportItem) => reportItem.Header_ID === item.Header_ID
          );
          let isPresent = isPresentadvance || isPresentoutstanding;
          
          // You can use `isPresent` if needed here
       let idstr = isPresent
         ? `(ID:${item?.Header_ID}*)`
         : `(ID:${item?.Header_ID})`;
          return item?.Description
            ? {
                ...item,
                Description: `${idstr}${item?.Description}`,
              }
            : {
                ...item,
                Description: idstr,
              };
        });

        const obj = updatedList.reduce((acc, item) => {
          const principalDR = parseFloat(item.Principal_DR) || 0;
          const principalCR = parseFloat(item.Principal_CR) || 0;
          const intDR = parseFloat(item.Int_DR) || 0;
          const intCR = parseFloat(item.Int_CR) || 0;

          acc.PrnCr += principalCR;
          acc.PrnDr += principalDR;
          acc.DuePrn += principalDR - principalCR;
          acc.IntCr += intCR;
          acc.IntDr += intDR;
          acc.DueInt += intDR - intCR;

          return acc;
        }, initialTotal);

        setTotal(obj);
      }

      setFilteredData(updatedList);
      setAdvanceData(AdvanceReport);
      setOutstandingData(OutstandingReport);
    }
  }, [LedgerViewList, viewType, isLedgerViewListError]);
  

  useEffect(() => {
    return () => {
      setFilters({ StartDate: null, EndDate: null });
      setTextDetail("");
      setFilteredData([]);
      setAdvanceData([]);
      setOutstandingData([]);
      setEditedData({});
      setSearchTerm("");
      setParams({ viewStartDatePicker: false, viewEndDatePicker: false });
      setViewType(1);
      setCustomer([]);
      setWholeseller([]);
      setSelectedEntityId(-1);
      ClearstateLedgerViewList();
    };
  }, []);

  useEffect(() => {
    fetchMahajonData({ Cust_Type: 3, CompanyID });
  }, []);

  const processSummaryData = (item) => ({
    ...item,
    TotalPrincipalDR: item.TotalPrincipalDR || 0,
    TotalPrincipalCR: item.TotalPrincipalCR || 0,
    TotalIntDR: item.TotalIntDR || 0,
    TotalIntCR: item.TotalIntCR || 0,
  });

  useEffect(() => {
    let str = "";
    let arr=entityType==1 ?customer:entityType==2?wholeseller:Mahajon;
    arr?.forEach((item) => {
      console.log(item);
      if (item?.value == selectedEntityId) {
        str = item?.label;
        return;
      }
    });
    console.log(str);
    setParams((prev) => ({ ...prev,SearchFor:str}));
  }, [selectedEntityId]);

  //-------------------------variables call-----------------------------
  const Mahajon = useMemo(() => {
    let arr = [];
    MahajonList?.forEach((element) => {
      let obj = {};
      obj.label = element?.Name;
      obj.value = element?.ID;
      arr.push(obj);
    });
    return arr || [];
  }, [MahajonList, isLoadingMahajon]);

  const columns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "String",
      width: "75px",
    },
    { headername: "Lot No", fieldname: "LotNo", type: "String", width: "92px" },
    { headername: "Srl", fieldname: "SRL", type: "String", width: "50px" },
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
      width: "130px",
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "190px",
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
  ];

  const summaryColumns = [
    { headername: "Lot No", fieldname: "LotNo", type: "String" },
    { headername: "SRL", fieldname: "SRL", type: "String", width: "50px" },
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

  const advanceColumns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "String",
      width: "100px",
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "100px",
    },
    {
      headername: "Others Cr.",
      fieldname: "CR_Amt",
      type: "String",
      width: "100px",
    },
    {
      headername: "Others Dr.",
      fieldname: "DR_Amt",
      type: "number",
      width: "100px",
    },
  ];

  const outstandingColumns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "String",
      width: "100px",
    },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "100px",
    },
    {
      headername: "Others Cr.",
      fieldname: "CR_Amt",
      type: "String",
      width: "100px",
    },
    {
      headername: "Others Dr.",
      fieldname: "DR_Amt",
      type: "number",
      width: "100px",
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
              <h5 className="mb-0" style={{ whiteSpace: "nowrap" }}>
                Ledger View for
                {entityType == 1
                  ? " Customer"
                  : entityType == 2
                  ? " WholeSeller"
                  : " Mahajon"}
              </h5>
            </div>

            <div
              className="d-flex align-items-center flex-wrap gap-3"
              style={{ flex: "1", justifyContent: "flex-end", flexShrink: 1 }}
            >
              {/* <BongDatePicker
                handleClose={HandleCloseDatePicker}
                handleOpenStartDate={HandleOpenStartDatePicker}
                handleOpenEndDate={HandleOpenEndDatePicker}
                handleChange={FilterHandler}
                view1={params?.viewStartDatePicker}
                view2={params?.viewEndDatePicker}
                startDate={Filters?.StartDate}
                endDate={Filters?.EndDate}
              /> */}

              <div style={{ width: "220px", minWidth: "180px" }}>
                <SearchableDropDown
                  options={
                    entityType == 1
                      ? customer
                      : entityType == 2
                      ? wholeseller
                      : Mahajon
                  }
                  handleChange={handleHeaderChange}
                  selectedVal={selectedEntityId}
                  label={"selectedEntityId"}
                  placeholder={
                    entityType == 1
                      ? "--Select Customer--"
                      : entityType == 2
                      ? "--Select Wholesaler--"
                      : "--Select Mahajon--"
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
                  setAdvanceData([]);
                  setOutstandingData([]);
                  ClearstateLedgerViewList();
                }}
                SelectStyle={{
                  width: "150px",
                  padding: "5px 8px",
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
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <textarea
            value={textDetail}
            readOnly
            type="search"
            placeholder="Detail View"
            className="detail-view-textarea"
          />
        </Col>
      </Row>

      {filteredData?.length > 0 ? (
        viewType == 1 ? (
          <div className="summary-view-container">
            <Row className="mb-0">
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="table-container"
              >
                <Table
                  Col={summaryColumns}
                  OnChangeHandler={OnChangeHandler}
                  tab={filteredData || []}
                  isLoading={isLedgerViewListLoading}
                  getFocusText={(val) => {
                    setTextDetail(val);
                  }}
                  showScrollButtons={filteredData?.length > 10}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <div className="detail-view-container">
            <Row className="mb-0">
              <Col
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="table-container"
                style={{ maxHeight: "55vh" }}
              >
                <Table
                  Col={columns}
                  OnChangeHandler={OnChangeHandler}
                  tab={filteredData || []}
                  isLoading={isLedgerViewListLoading}
                  getFocusText={(val) => {
                    setTextDetail(val);
                  }}
                  height={"55vh"}
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
                  isFooter={true}
                  showScrollButtons={filteredData?.length > 10}
                />
              </Col>
            </Row>
            <hr />
            {(advanceData?.length > 0 || outstandingData?.length > 0) && (
              <Row className="mt-3">
                {advanceData?.length > 0 && (
                  <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                    <h6 className="mb-2 px-2">Advance Report</h6>
                    <Table
                      Col={advanceColumns}
                      tab={advanceData}
                      isLoading={isLedgerViewListLoading}
                      showScrollButtons={advanceData?.length > 10}
                    />
                  </Col>
                )}

                {outstandingData?.length > 0 && (
                  <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                    <h6 className="mb-2 px-2">Outstanding Report</h6>
                    <Table
                      Col={outstandingColumns}
                      tab={outstandingData}
                      isLoading={isLedgerViewListLoading}
                      showScrollButtons={outstandingData?.length > 10}
                    />
                  </Col>
                )}
              </Row>
            )}
            {/* Net Balance Row - Add this new section */}
            <Row className="mt-4">
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <div className="net-balance-container p-3 bg-light border rounded">
                  <div className="d-flex justify-flex-start align-items-center">
                    <span className="fw-bold">Net Balance:</span>
                    <div>
                      <span className="me-2 m-2">
                        {calculateNetBalance.amount.toFixed(2)}
                      </span>
                      <span
                        className={
                          calculateNetBalance.type === "Dr"
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {calculateNetBalance.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )
      ) : isLedgerViewListLoading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className="text-muted">
            {isLedgerViewListError
              ? "No results found."
              : "Use the filters to find ledger data."}
          </div>
        </div>
      )}
      <div className="d-flex justify-content-end my-2">
        {
          viewType !== 1 ?<button className="btn btn-success" onClick={()=>{getReports(
            filteredData,
            columns,
            advanceData,
            advanceColumns,
            outstandingData,
            outstandingColumns,
            entityType,
            params?.SearchFor,
            Total,calculateNetBalance
          );}}>
          <i className="bi bi-floppy-fill">

          </i>
</button>:null
        }
        
      </div>
    </Container>
  );
}

export default LedgerView;
