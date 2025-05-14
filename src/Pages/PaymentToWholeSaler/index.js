"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import SearchableDropDown from "../../Component/SearchableDropDown";
import InputBox from "../../Component/InputBox";
import Table from "../../Component/Table";
import BongDatePicker from "../../Component/BongDatePicker";
import BongCalender from "../../Component/BongCalender";
import "./payment.css";

import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../GlobalFunctions/Ordercheck";

import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchCostCenter from "../../store/ShowStore/useFetchCostCenter";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWholesalerLoan from "../../store/ShowStore/useFetchWholesalerLoan";
import useAddPaymentWholsaler from "../../store/AddStore/useAddPaymentWholsaler";
import { toast, ToastContainer } from "react-toastify";

import DeleteConfirmation from "../../Component/ReusableDelete";
import usePaymentWholsalerDeleteCheck from "../../store/Checker/usePaymentWholsalerDeleteCheck";
import usePMWDelete from "../../store/DeleteStore/usePMWDelete";
import SelectOption from "../../Component/SelectOption";

function PaymentToWholeSaler() {
  //------------------------------------useRef-------------------------------------------//
  const inputRef = useRef(null);
  //--------------------------------------useState--------------------------------------//
  const [wholesalerloan, setWholesalerloan] = useState({
    WholeSalerID: -1,
    Narration: "",
    CostCenterID: -1,
    Amount: "",
    Interest: "",
    EntryDate: "",
    OpeningCheck: 0,
  });
  const [originalOrder, setOriginalOrder] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [focusText, setfocusText] = useState("");
  const [params, setParams] = useState({
    view1: false,
    view2: false,
    view: false,
  });
  const [Filters, setFilters] = useState({
    keyword: "",
    StartDate: "",
    EndDate: "",
    TransStatus: 2,
  });

  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //----------------------------------------API-------------------------------------------//
  const { fetchWSomrData, WholeSellerList } = useFetchWS();
  const { CompanyID, user } = useFetchAuth();
  const { fetchCostCenter, CostCenterList } = useFetchCostCenter();
  const {
    fetchWholeSalerLoanList,
    WholeSalerLoanList,
    isWholeSalerLoanListSuccess,
    errorWholeSalerLoanList,
    isLoadingWholeSalerLoanList,
    ClearWholeSalerLoanList,
  } = useFetchWholesalerLoan();
  const {
    PaymentWholsalerAdd,
    PaymentWholsalerError,
    isPaymentWholsalerLoading,
    PaymentWholsalerSuccess,
    ClearStatePaymentWholsalerAdd,
  } = useAddPaymentWholsaler();

  const {
    CheckPMWDeleteCheck,
    ClearCheckPMWDeleteCheck,
    CheckPMWDeleteCheckErr,
    isCheckPMWDeleteCheckLoading,
    isCheckPMWDeleteCheck,
    CheckPMWDeleteCheckMsg,
  } = usePaymentWholsalerDeleteCheck();
  const {
    PMWDeleteMsg,
    isPMWDeleteLoading,
    PMWDeleteErr,
    DeletePMW,
    ClearPMWDelete,
  } = usePMWDelete();

  //----------------------------------------------function------------------------------------//
  const OnChangeHandler = (e) => {
    const key = e.target.name;
    const val = e.target.value;
    const regexAmt = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (key === "Amount" && !regexAmt.test(val) && val !== "") return;
    setWholesalerloan({ ...wholesalerloan, [key]: val });
  };
  //give wholesaler loan
  const handleClose = () => {
    setParams({ ...params, view1: false, view2: false, view: false });
  };
  const handleOpenStartDate = () => {
    setParams({ ...params, view1: true });
  };
  const handleOpenEndDate = () => {
    setParams({ ...params, view2: true });
  };
  const handleEntryDate = () => {
    setParams({ ...params, view: true });
  };
  const DatePickerHandler = (val, name) => {
    setFilters({ ...Filters, [name]: val });
  };
  const EntryDateHandler = (val1, val2) => {
    setWholesalerloan({ ...wholesalerloan, EntryDate: val1 });
    handleClose();
  };
  const HandlefilterChange = (e) => {
    const key = e.target.name;
    const val = e.target.value;
    setFilters({ ...Filters, [key]: val });
  };
  const handleDeleteClick = (index) => {
    const deleteobj = filteredData[index];
    // Immediately set the item to delete
    setItemToDelete(deleteobj);
    // Initiate the delete check
    CheckPMWDeleteCheck({
      ID: deleteobj.ID,
      // Cust_Type: entityType,
      LotNo: deleteobj.LotNo,
      // TranCode: trancode,
    });
  };
  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await DeletePMW({
          ID: itemToDelete.ID,
          LotNo: itemToDelete.LotNo,
        });
        // Refresh data after successful deletion
        if (
          (params?.StartDate && !params?.EndDate) ||
          (!params?.StartDate && params?.EndDate)
        ) {
          return;
        } else {
          fetchWholeSalerLoanList({ CompanyID, ...Filters });
        }
      } catch (err) {
        // console.log(err);
      } finally {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const AddLoan = () => {
    const {
      WholeSalerID,
      CostCenterID,
      Amount,
      Interest,
      Narration,
      EntryDate,
    } = wholesalerloan;

    if (
      WholeSalerID === -1 ||
      CostCenterID === -1 ||
      Amount === "" ||
      Interest === "" ||
      Narration === "" ||
      EntryDate === ""
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    PaymentWholsalerAdd(wholesalerloan);
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
    } else if ((type = "BongDate")) {
      result = BongDateSorting(newOrder, filteredData, header);
    }
    // console.log(result);
    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };
  //-----------------------------------------------useEffect----------------------------------//

  //api fetch
  useEffect(() => {
    fetchWholeSalerLoanList({ CompanyID, ...Filters });
  }, [Filters, PaymentWholsalerSuccess]);
  useEffect(() => {
    fetchWSomrData({ CompanyID });
    fetchCostCenter({ CompanyID, Type: 2 });
  }, []);
  useEffect(() => {
    if (PaymentWholsalerSuccess) {
      toast.success(PaymentWholsalerSuccess);
      // setSelectedRows(new Set());
      // setEditedData({});
      // setMasterToggle(false);
      setWholesalerloan({
        WholeSalerID: -1,
        Narration: "",
        CostCenterID: -1,
        Amount: "",
        Interest: "",
        EntryDate: "",
        OpeningCheck: 0,
      });
    }
    if (PaymentWholsalerError) {
      toast.error(PaymentWholsalerError);
    }
    ClearStatePaymentWholsalerAdd();
  }, [PaymentWholsalerSuccess, PaymentWholsalerError]);

  // Update filtered data when EntryList changes
  useEffect(() => {
    if (originalOrder.length > 0 && WholeSalerLoanList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => WholeSalerLoanList.find((row) => row.ID === id))
        .filter(Boolean);
      setFilteredData(sortedData);
    } else {
      setFilteredData(WholeSalerLoanList);
    }
    ClearWholeSalerLoanList();
  }, [WholeSalerLoanList, isWholeSalerLoanListSuccess]);

  // Updated useEffect for delete check
  useEffect(() => {
    if (isCheckPMWDeleteCheck === 1 && itemToDelete) {
      setShowDeleteModal(true);
      ClearCheckPMWDeleteCheck();
    } else if (isCheckPMWDeleteCheck === 0) {
      toast.warning(CheckPMWDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
      ClearCheckPMWDeleteCheck();
      // setItemToDelete(null);
    }
  }, [isCheckPMWDeleteCheck, itemToDelete]);

  useEffect(() => {
    if (PMWDeleteMsg) {
      toast.success(PMWDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (PMWDeleteErr) {
      toast.error(PMWDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearPMWDelete();
  }, [PMWDeleteErr, isPMWDeleteLoading, PMWDeleteMsg]);

  //--------------------------------------------useMemo-----------------------------------------//

  const WholeSalerOption = useMemo(() => {
    return WholeSellerList?.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [WholeSellerList]);
  const CostCenterOption = useMemo(() => {
    return CostCenterList?.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [CostCenterList]);

  const Column = [
    {
      headername: "Lot No",
      fieldname: "LotNo",
      type: "String",
      width: "140px",
    },
    {
      headername: "WholeSaler",
      fieldname: "WholeSellerName",
      type: "String",
      width: "140px",
    },

    {
      headername: "Amount",
      fieldname: "AMOUNT",
      type: "number",
      width: "140px",
    },
    {
      headername: "Interest",
      fieldname: "InterestPercentage",
      type: "number",
      width: "140px",
    },
    {
      headername: "CostCenter",
      fieldname: "CostCenterName",
      type: "String",
      width: "140px",
    },
    {
      headername: "EntryDate",
      fieldname: "EntryDate",
      type: "BongDate",
      width: "140px",
    },
    {
      headername: "Narration",
      fieldname: "Description",
      type: "String",
      width: "140px",
    },
  ];
  return (
    <Container fluid style={{ marginTop: "60px" }}>
      <ToastContainer autoClose={3000} />
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <h5 style={{ fontSize: "18px" }}>Payment To WholeSaler</h5>
          <hr />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <table
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <thead className="tab-head">
              <tr>
                <th
                  style={{
                    padding: "3px 10px",
                    borderBottom: "1px solid lightgrey",
                  }}
                >
                  <i className="bi bi-person-circle"></i>
                </th>
                <th>WholeSaler*</th>
                <th>Amount(₹)*</th>
                <th>Interest(%)*</th>
                <th>Cost Center*</th>
                <th>EntryDate*</th>
                <th>Narration</th>
                <th>Opening Entry</th>
              </tr>
            </thead>

            <tbody className="tab-body">
              <tr>
                <td>
                  <i className="bi bi-caret-right-fill"></i>
                </td>
                <td>
                  <SearchableDropDown
                    options={WholeSalerOption}
                    handleChange={OnChangeHandler}
                    selectedVal={wholesalerloan?.WholeSalerID}
                    label={"WholeSalerID"}
                    placeholder={"--Select WholeSaler--"}
                    key={2}
                    defaultval={-1}
                    width={"100%"}
                    directSearch={true}
                  />
                </td>
                <td>
                  <InputBox
                    ref={inputRef}
                    Icon={<i className="bi bi-cash"></i>}
                    type="number"
                    placeholder="Amount(₹)"
                    label="Amount"
                    Name="Amount"
                    onChange={OnChangeHandler}
                    error={false}
                    errorMsg={""}
                    maxlen={""}
                    value={wholesalerloan?.Amount}
                    InputStyle={{ padding: "8px 10px", width: "100%" }}
                  />
                </td>
                <td>
                  <InputBox
                    ref={inputRef}
                    Icon={"%"}
                    type="number"
                    placeholder="Interest(%)"
                    label="Interest"
                    Name="Interest"
                    onChange={OnChangeHandler}
                    error={false}
                    errorMsg={""}
                    maxlen={""}
                    value={wholesalerloan?.Interest}
                    InputStyle={{ padding: "8px 10px", width: "100%" }}
                  />
                </td>
                <td>
                  <SearchableDropDown
                    options={CostCenterOption}
                    handleChange={OnChangeHandler}
                    selectedVal={wholesalerloan?.CostCenterID}
                    label={"CostCenterID"}
                    placeholder={"--Select CostCenter--"}
                    key={2}
                    defaultval={-1}
                    width={"100%"}
                    directSearch={true}
                  />
                </td>
                <td>
                  <InputBox
                    ref={inputRef}
                    type="text"
                    placeholder="EntryDate"
                    label="EntryDate"
                    Name="EntryDate"
                    onChange={OnChangeHandler}
                    error={false}
                    errorMsg={""}
                    maxlen={10}
                    SearchIcon={<i className="bi bi-calendar"></i>}
                    SearchButton={true}
                    SearchHandler={handleEntryDate}
                    isfrontIconOff={true}
                    value={wholesalerloan?.EntryDate}
                    InputStyle={{ padding: "8px 10px", width: "100%" }}
                  />
                  <BongCalender
                    handleSave={EntryDateHandler}
                    handleclose={handleClose}
                    view={params?.view}
                    key={1}
                  />
                </td>
                <td>
                  <InputBox
                    ref={inputRef}
                    Icon={<i className="bi bi-file-earmark-text"></i>}
                    type="text"
                    placeholder="Narration"
                    label="Narration"
                    Name="Narration"
                    onChange={OnChangeHandler}
                    error={false}
                    errorMsg={""}
                    maxlen={""}
                    value={wholesalerloan?.Narration}
                    InputStyle={{ padding: "8px 10px", width: "100%" }}
                  />
                </td>
                <td>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "100%" }}
                  >
                    <input
                      type="checkbox"
                      id="openingCheck"
                      name="OpeningCheck"
                      checked={wholesalerloan.OpeningCheck === 1}
                      onChange={(e) =>
                        setWholesalerloan({
                          ...wholesalerloan,
                          OpeningCheck: e.target.checked ? 1 : 0,
                        })
                      }
                      style={{ marginRight: "5px" }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center my-1">
            <div>
              <h6 className="mt-1">Detail View</h6>
            </div>
            <div>
              <Button
                onClick={AddLoan}
                className="py-1 px-2"
                // disabled={!isHeaderFilled || isCheckLotLoading}
              >
                {isPaymentWholsalerLoading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <i className="bi bi-plus-lg"></i>
                )}
              </Button>{" "}
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center">
              <div>
                <SelectOption
                  OnSelect={HandlefilterChange}
                  PlaceHolder={"--Select Status--"}
                  SName={"TransStatus"}
                  SelectStyle={{
                    padding: "5px 10px",
                    width: "150px",
                  }}
                  Value={Filters?.TransStatus}
                  sdisabled={false}
                  Soptions={[
                    { Name: "All", Value: -1 },
                    { Name: "Running", Value: 2 },
                    { Name: "Closed", Value: 1 },
                  ]}
                />
              </div>
              <div>
                <BongDatePicker
                  startDate={Filters?.StartDate}
                  endDate={Filters?.EndDate}
                  handleChange={DatePickerHandler}
                  handleClose={handleClose}
                  handleOpenEndDate={handleOpenEndDate}
                  handleOpenStartDate={handleOpenStartDate}
                  view1={params?.view1}
                  view2={params?.view2}
                />
              </div>
            </div>
            <div>
              <InputBox
                type={"text"}
                placeholder={"Search Here....."}
                label={"Search Here"}
                Name={"keyword"}
                onChange={HandlefilterChange}
                error={false}
                errorMsg={""}
                maxlen={255}
                value={Filters?.keyword}
                InputStyle={{ padding: "6px 10px", width: "300px" }}
                SearchButton={false}
                isfrontIconOff={true}
              />
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <textarea
            value={focusText}
            type="search"
            readOnly
            placeholder="Detail View"
            style={{
              width: "100%",
              border: "2px solid #ced4da",
              borderRadius: "8px",
              padding: "6px 10px",
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
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Table
            tab={filteredData || []}
            Col={Column}
            OnChangeHandler={OnChangeHandler}
            isLoading={isLoadingWholeSalerLoanList}
            height={"300px"}
            width={"100%"}
            onSorting={SortingFunc}
            getFocusText={(value) => {
              setfocusText(value);
            }}
            isDelete={true}
            handleDelete={handleDeleteClick}
          />
          <DeleteConfirmation
            show={showDeleteModal}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isLoading={isPMWDeleteLoading}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentToWholeSaler;
