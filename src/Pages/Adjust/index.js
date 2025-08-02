import { useEffect, useState, useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate, useSearchParams } from "react-router";
import "./Adjust.css";
import {
  Row,
  Col,
  Form,
  Container,
  InputGroup,
  Button,
  Card,
} from "react-bootstrap";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
import Table from "../../Component/Table";
import InputBox from "../../Component/InputBox";
import BongCalender from "../../Component/BongCalender";
import SelectOption from "../../Component/SelectOption";
import ReusableModal from "../../Component/ReusableModal";
import EstimateTable from "../../Component/EstimateTable";
import useFetchAllLotsSearch from "../../store/ShowStore/useFetchAllLotsSearch";
import { toast, ToastContainer } from "react-toastify";
import Calculate from "./Calculate";
import ReceiveInterest from "./ReceiveInterest";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
function AdjustEntry() {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  let entityType =
    searchParams.get("type") === "customer"
      ? 1
      : searchParams.get("type") === "wholeseller"
      ? 2
      : 3;
  let trancode = searchParams.get("trancode");
  const searchInputRef = useRef(null); // Create a ref for the search inputRef
  const { user, CompanyID } = useFetchAuth();
  const [showReceiveInterest, setShowReceiveInterest] = useState(false);

  // State for search and filters
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [custId, setCustId] = useState(null);
  const [searchHeaderID, setSearchHeaderID] = useState(-1);
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    view: false,
  });
  const [checkedIds, setCheckedIds] = useState([]);
  // State for form data
  const [voucherDate] = useState(() => {
    const today = new Date();
    // Format to YYYY-MM-DD (HTML date input format)
    return today.toISOString().split("T")[0];
  });
  const [fineInterestCode, setFineInterestCode] = useState(-1);
  const [narration, setNarration] = useState("");
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [calculationData, setCalculationData] = useState([]);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [customerBalanceAmount, setCustomerBalanceAmount] = useState(0);
  const [refundAmount, setRefundAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  // ----------------Fetch data from API----------------------
  const {
    AllLotsSearchList,
    isLoadingAllLotsSearch,
    errorAllLotsSearch,
    ClearAllLotsSearchList,
    fetchLotsSearchList,
  } = useFetchAllLotsSearch();

  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();

  // Fine Interest Code options
  const SelectOptionFineInterestCode = useMemo(() => {
    let frstVal = [{ Name: "--Select Fine Interest Code--", Value: -1 }];
    let fineList = FineHeaderList.map((item) => ({
      Name: `${item?.CODE}`,
      Value: item?.ID,
    }));
    return [...frstVal, ...fineList];
  }, [FineHeaderList]);

  // Handle checkbox changes
  const handleCheckChange = (item, isChecked) => {
    setCheckedIds((prev) => {
      // Get current customer IDs from checked items
      const existingCustomerIds = [...new Set(prev.map((i) => i.CustomerId))];

      if (
        isChecked &&
        existingCustomerIds.length > 0 &&
        !existingCustomerIds.includes(item.CustomerID) // Using every()
      ) {
        toast.dismiss();
        // alert("You can only select items from the same customer!");
        toast.error("You can only select items from the same customer!");
        return prev;
      } else {
        setCustId(item?.CustomerID);
        // setLotNo(item?.LotNo);
      }

      return isChecked
        ? [
            ...prev,
            {
              LotNo: item.LotNo,
              CustomerId: item.CustomerID,
              TranCode: item.TRANCODE,
            },
          ]
        : prev.filter((i) => i.LotNo !== item.LotNo);
    });
  };

  // Table handlers
  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === "FineId") {
      setFineInterestCode(value);
    } else {
      setEditedData({ ...editedData, [key]: value });
    }
  };
  const onSelect = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === "FineId") {
      setFineInterestCode(value);
    } else {
      setEditedData({ ...editedData, [key]: value });
    }
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;

    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    } else if (type === "BongDate") {
      result = BongDateSorting(newOrder, filteredData, header);
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };

  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setEditedData({});
  };



  const handleViewClick = (tabindex) => {
    const selectedData = filteredData[tabindex];
    setSelectedId(selectedData.ID);
  };
  // Replace handleCalculateInterest to show modal
  const handleCalculateInterest = () => {
    if (checkedIds.length === 0) {
      toast.dismiss();
      toast.error("Please select at least one entry.");
      return;
    }
    setShowCalculationModal(true);
    setShowReceiveInterest(false);
  };

  // Handle save from Calculate component
  const handleSaveCalculation = (data, SearchId) => {
    // Validate that toggled rows are consecutive
    const validationErrors = [];

    data.forEach((group) => {
      // Get all Adjust rows (excluding Total)
      const adjustRows = group.filter(
        (row) => row.interfaceName === "Adjust" && row.isToggled
      );

      if (adjustRows.length > 0) {
        // Get unique identifier for this group
        const groupKey = `${adjustRows[0].lotNo}-${adjustRows[0].srl}-${adjustRows[0].srl_Prn}`;

        // Extract and sort the period numbers from the startDate
        const periodNumbers = adjustRows
          .map(
            (row) => parseInt(row.startDate.split("-")[1], 10) // Extract month number
          )
          .sort((a, b) => a - b);

        // Check for consecutive sequence
        for (let i = 1; i < periodNumbers.length; i++) {
          if (periodNumbers[i] - periodNumbers[i - 1] !== 1) {
            validationErrors.push(
              `Missing periods in group ${groupKey}. ` +
                `Found periods: ${periodNumbers.join(", ")}`
            );
            break;
          }
        }
      }
    });

    // If validation errors found, show them and abort
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    // Proceed with saving if validation passes
    if (SearchId != -1 || SearchId != null) {
      setSearchHeaderID(SearchId);
    }

    let arr = [];
    data?.forEach((item) => {
      let lastindex = item?.length - 1;
      if (
        item[lastindex]?.interfaceName == "Total" &&
        (item[lastindex]?.interestCr != "" ||
          item[lastindex]?.principalCr != "")
      ) {
        arr.push(item);
      }
    });

    setCalculationData(arr);
    setShowCalculationModal(false);
    setShowReceiveInterest(true);
  };

  const performSearch = (etype) => {
    if (!searchTerm.trim() && !searchDate) return;

    // Create search parameters
    const searchParams = {
      CompanyID: user?.CompanyID,
    };

    // Add search term if provided
    if (searchTerm.trim()) {
      searchParams.keyword = searchTerm;
    }

    // Add date if provided
    if (searchDate) {
      searchParams.date = searchDate;
    }

    // Call the search API
    fetchLotsSearchList({ ...searchParams, Cust_Type: etype });
  };

  // Table columns
  const columns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "BongDate",
      width: "150px",
    },
    { headername: "LotNo", fieldname: "LotNo", type: "String", width: "280px" },
    {
      headername: "Name",
      fieldname: "CustomerName",
      type: "String",
      width: "250px",
    },
  ];
  //-----------------------------useEffect---------------------------------

  // Calculate balance amount
  useEffect(() => {
    const totalPaid = calculationData.reduce(
      (sum, row) =>
        sum +
        Number(row.principalAmount || 0) +
        Number(row.interestAmount || 0),
      0
    );

    const balance =
      principalAmount +
      Number(receiveAmount) +
      Number(customerBalanceAmount) -
      totalPaid -
      Number(refundAmount);
    setBalanceAmount(balance);
  }, [
    principalAmount,
    receiveAmount,
    customerBalanceAmount,
    calculationData,
    refundAmount,
  ]);
  // Search functionality
  useEffect(() => {
    setFilteredData((prev) => []);
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() || searchDate) {
        setCheckedIds([]);
        performSearch(entityType);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchDate]);

  // Update filtered data when EntryList changes
  useEffect(() => {
    if (AllLotsSearchList?.length >= 0) {
      setFilteredData(AllLotsSearchList);
    }

    if (!searchTerm && !searchDate) {
      setFilteredData((prev) => []);
    }
  }, [searchDate, searchTerm, AllLotsSearchList, entityType]);

  // Fetch fine header data
  useEffect(() => {
    fetchFineHeader({ CompanyID });
  }, [CompanyID, fetchFineHeader]);
  //focus manag
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setSearchDate("");
    setSearchTerm("");
    setFineInterestCode(-1);
    setCustId(null);
    setFilteredData(() => []);
    entityType = 0;
  }, [entityType]);

  const excludedLotNos = useMemo(
    () => checkedIds.map((item) => item.LotNo),
    [checkedIds]
  );

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-3">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="m-0" style={{ height: "100%" }}>
                Adjust Entry For{" "}
                {entityType == 1
                  ? "Customer"
                  : entityType == 2
                  ? "Wholesaler"
                  : "Mahajon"}
              </h5>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="mx-3">
                <SelectOption
                  defaultval={-1}
                  OnSelect={onSelect}
                  SName={"FineId"}
                  Soptions={SelectOptionFineInterestCode}
                  PlaceHolder={"--Select Fine Interest Code--"}
                  Value={fineInterestCode}
                  SelectStyle={{ width: "250px", padding: "7px 8px" }}
                  key={1}
                />
              </div>
              <div>
                <InputGroup>
                  <Form.Control
                    // autoFocus
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search..."
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    style={{
                      zIndex: "1",
                      width: "300px",
                      padding: "4px 5px",
                      borderRadius: "5px",
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        performSearch();
                      }
                    }}
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
            style={{ height: "50vh", border: "1px solid lightgrey" }}
          >
            {filteredData.length > 0 ? (
              <Table
                Col={columns}
                onSorting={SortingFunc}
                OnChangeHandler={OnChangeHandler}
                tab={filteredData || []}
                ActionId={params?.ActionID}
                isEdit={false}
                isLoading={isLoadingAllLotsSearch}
                ActionFunc={ActionFunc}
                isView={false}
                setParams={setParams}
                handleViewClick={(index) => {
                  handleViewClick(index);
                  setParams({ ...params, view: true });
                }}
                EditedData={editedData}
                OnSaveHandler={() => {}}
                isCheck={true}
                checkedIds={checkedIds}
                onCheckChange={handleCheckChange}
              />
            ) : isLoadingAllLotsSearch ? (
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

        {/* Calculate Interest Button */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-end align-items-center mt-2">
           
            <Button
              variant="success"
              onClick={handleCalculateInterest}
              style={{ marginRight: "5px" }}
              disabled={checkedIds.length === 0}
            >
              <i className="bi bi-calculator"></i> Calculate Interest
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal for Interest Calculation */}
      <ReusableModal
        show={showCalculationModal}
        Title={"Interest Calculation"}
        isFooterOff={true}
        handleClose={() => setShowCalculationModal(false)}
        isFullScreen={true}
        isCustomHeader={true}
        body={
          <div style={{ maxHeight: "85vh" }}>
            <Calculate
              checkedIds={checkedIds}
              voucherDate={voucherDate}
              fineInterestCode={fineInterestCode}
              narration={narration}
              onSave={handleSaveCalculation}
              onClose={() => setShowCalculationModal(false)}
              entityType={entityType}
            />
          </div>
        }
      />
      {/* {showReceiveInterest && ( */}
      <ReceiveInterest
        CalculateData={calculationData}
        custId={custId}
        entityType={entityType}
        onSave={handleSaveCalculation}
        narration={narration}
        onClose={() => setShowReceiveInterest(false)} // Add this prop
        showReceiveInterest={showReceiveInterest}
        // setShowReceiveInterest={setShowReceiveInterest}
        LotNo={excludedLotNos}
        fineInterestCode={fineInterestCode}
        TranCode={trancode}
        searchHeaderID={searchHeaderID}
      />
      {/* )} */}
    </Container>
  );
}

export default AdjustEntry;
