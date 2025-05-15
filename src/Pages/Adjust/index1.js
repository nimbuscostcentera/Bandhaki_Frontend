import { useEffect, useState, useMemo, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate, useSearchParams } from "react-router";
import  './Adjust.css'
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
  let entityType = searchParams.get("type") === "customer" ? 1 : 2;
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
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    view: false,
  });
  const [view, setView] = useState(false);
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
  const [lotNo, setLotNo] = useState("");
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
        setCustId(item.CustomerID);
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

  // Calendar handlers
  const handleShow = () => {
    setView(true);
  };

  const handleClose1 = () => {
    setView(false);
  };

  const handleSave1 = (BengaliDate, EnglishDate) => {
    setSearchDate(BengaliDate);
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

  const handleClose = () => {
    setParams({ ...params, view: false });
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
  const handleSaveCalculation = (data) => {
    // Update state or submit data as needed
    let arr = [];
    data?.forEach((item) => {
      let lastindex = item?.length - 1;
      if (
        item[lastindex]?.interfaceName == "Total" &&
        (item[lastindex]?.interestCr != "" ||
          item[lastindex]?.principalCr != "")
      ) {
        console.log(item);
        arr.push(item);
      }
    });
    console.log(arr);
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
    },
    { headername: "LotNo", fieldname: "LotNo", type: "String" },
    {
      headername: "Customer Name",
      fieldname: "CustomerName",
      type: "String",
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
      setFilteredData((prev)=>[]);
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() || searchDate ) {
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
        setFilteredData((prev)=>[]);
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
    setCustId([]);
    setFilteredData(() => []);
    entityType=0;
  }, [entityType]);

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2">
                Adjust Entry For {entityType == 1 ? "Customer" : "Wholeseller"}
              </h5>
            </div>

            <div className="my-2 d-flex justify-content-start align-items-center flex-wrap">
              <div>
                <label className=" fs-6 d-block">
                  Voucher Date &nbsp;&nbsp;
                </label>
              </div>
              <div>
                <InputBox
                  Icon={<i className="bi bi-calendar"></i>}
                  type="text"
                  value={voucherDate}
                  readOnly
                  disabled
                  className="disabled-date-input"
                />{" "}
              </div>
            </div>
          </div>
          <hr className="my-1" />
        </Col>

        {/* Form Fields */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
          <Row>
            <Col xs={12} sm={12} md={12} lg={5}>
              <div className="d-flex justify-content-start flex-wrap me-3 mt-2">
                <div>
                  <label className=" fs-6 d-block">
                    Fine Code: &nbsp; &nbsp;
                  </label>
                </div>
                <div>
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
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={7}>
              <div className="d-flex align-items-center justify-content-center text-nowrap">
                {/* Date Picker */}
                <label className="mt-1">Search By Date &nbsp;&nbsp;</label>
                <Form.Group className="me-3 mt-2">
                  <InputBox
                    type="text"
                    placeholder="yyyy-mm-dd"
                    label="date"
                    Name="date"
                    onChange={(e) => setSearchDate(e.target.value)}
                    Icon={<i className="bi bi-calendar"></i>}
                    SearchButton={true}
                    SearchIcon={<i className="bi bi-calendar fs-5"></i>}
                    SearchHandler={handleShow}
                    value={searchDate || ""}
                    isfrontIconOff={true}
                    InputStyle={{ padding: "8px", width: "150px" }}
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
                    // autoFocus
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search..."
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    style={{ width: "200px", zIndex: "1" }}
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
            </Col>
          </Row>
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
            {/* <Button
              variant="primary"
              onClick={handleViewReport}
              style={{ marginRight: "5px" }}
              // disabled={checkedIds.length === 0}
            >
              <i className="bi bi-eye-fill"></i> View
            </Button> */}
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
        // isPrimary={true}
        handleClose={() => setShowCalculationModal(false)}
        // handlePrimary={() => setShowCalculationModal(false)}
        // PrimaryButtonName={"Submit"}
        size="xl" // Use "xl" for extra large modal
        body={
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
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
        fineInterestCode={fineInterestCode}
      />
      {/* )} */}
    </Container>
  );
}

export default AdjustEntry;
