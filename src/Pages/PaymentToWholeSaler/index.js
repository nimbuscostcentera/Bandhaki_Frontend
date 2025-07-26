"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {useSearchParams} from "react-router-dom";
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
import useFetchCust from "../../store/ShowStore/useFetchCust"
import useFetchCostCenter from "../../store/ShowStore/useFetchCostCenter";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import useFetchWholesalerLoan from "../../store/ShowStore/useFetchWholesalerLoan";
import useAddPaymentWholsaler from "../../store/AddStore/useAddPaymentWholsaler";
import { toast, ToastContainer } from "react-toastify";

import DeleteConfirmation from "../../Component/ReusableDelete";
import usePaymentWholsalerDeleteCheck from "../../store/Checker/usePaymentWholsalerDeleteCheck";
import usePMWDelete from "../../store/DeleteStore/usePMWDelete";
import SelectOption from "../../Component/SelectOption";

function PaymentToWholeSaler() {
  const [searchParams] = useSearchParams();
  const entityType =  searchParams.get("type") === "wholeseller"
    ? 2
    : searchParams.get("type") === "customer"
  ?1
  : 3;
  const trancode = searchParams.get("trancode");
  const { CompanyID, user } = useFetchAuth();
  //------------------------------------useRef-------------------------------------------//
  const inputRef = useRef(null);
  //--------------------------------------useState--------------------------------------//
  const [wholesalerloan, setWholesalerloan] = useState({
    WholeSalerID: -1,
    Narration: "",
    CostCenterID: -1,
    Amount: "",
    Interest: "",
    EntryDate: user?.date,
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


  useEffect(() => {
    return () => {
      setParams({
        view1: false,
        view2: false,
        view: false,
      });
      setFilters({
        keyword: "",
        StartDate: "",
        EndDate: "",
        TransStatus: 2,
      });
      setWholesalerloan({
        WholeSalerID: -1,
        Narration: "",
        CostCenterID: -1,
        Amount: "",
        Interest: "",
        EntryDate: user?.date,
        OpeningCheck: 0,
      });
      setOriginalOrder([]);
      setFilteredData([]);
    };
  }, [entityType, trancode]);
  //----------------------------------------API-------------------------------------------//
  const { fetchWSomrData, WholeSellerList } = useFetchWS();

  const { fetchCostCenter, CostCenterList } = useFetchCostCenter();
  const {
    fetchWholeSalerLoanList,
    WholeSalerLoanList,
    isWholeSalerLoanListSuccess,
    errorWholeSalerLoanList,
    isLoadingWholeSalerLoanList,
    ClearWholeSalerLoanList,
  } = useFetchWholesalerLoan();
  const {fetchCustomrData,errorCustList,isLoadingCustList,CustomerList}=useFetchCust()
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
  const { fetchMahajonData, MahajonList, isLoadingMahajon, errorMahajon } =
    useFetchMahajon();
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
      Cust_Type: entityType,
      LotNo: deleteobj.LotNo,
      TranCode: trancode,
    });
  };
  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        console.log(itemToDelete);
        await DeletePMW({
          ID: itemToDelete.ID,
          LotNo: itemToDelete.LotNo,
          Cust_Type: entityType,
          TranCode: trancode,
        });
        // Refresh data after successful deletion
        if (
          (params?.StartDate && !params?.EndDate) ||
          (!params?.StartDate && params?.EndDate)
        ) {
          return;
        } else {
          fetchWholeSalerLoanList({TranCode:trancode, Cust_Type: entityType, CompanyID, ...Filters });
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
      EntryDate === ""
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    PaymentWholsalerAdd({...wholesalerloan,TranCode:trancode,Cust_Type:entityType});
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
    fetchWholeSalerLoanList({ CompanyID, ...Filters, Cust_Type: entityType });
  }, [Filters, PaymentWholsalerSuccess]);

  useEffect(() => {
    fetchWSomrData({ CompanyID });
    fetchCostCenter({ CompanyID, Type:entityType });
    fetchMahajonData({ CompanyID, Cust_Type: entityType, TranCode: trancode });
    fetchCustomrData({ CompanyID, Cust_Type: entityType, TranCode: trancode });
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
        EntryDate: user?.date,
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

  const CustomerOption = useMemo(() => {
    return CustomerList?.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [CustomerList]);

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
      width: "120px",
    },
    {
      headername: `${entityType==1?"Customer":entityType==2?"WholeSaler":"Mahajon"}`,
      fieldname: "WholeSellerName",
      type: "String",
      width: "130px",
    },

    {
      headername: "Amount",
      fieldname: "AMOUNT",
      type: "number",
      width: "100px",
    },
    {
      headername: "Interest",
      fieldname: "InterestPercentage",
      type: "number",
      width: "90px",
    },
    {
      headername: "CostCenter",
      fieldname: "CostCenterName",
      type: "String",
      width: "90px",
    },
    {
      headername: "EntryDate",
      fieldname: "EntryDate",
      type: "BongDate",
      width: "100px",
    },
    {
      headername: "Narration",
      fieldname: "Description",
      type: "String",
      width: "300px",
    },
  ];
  const MahaJonOption=useMemo(()=>{
    return MahajonList?.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  },[MahajonList]);
  return (
    <Container fluid style={{ marginTop: "50px" }}>
      <ToastContainer autoClose={3000} />
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <h5>Payment {
            entityType == 2 ?
              " To WholeSaler" :
              entityType == 1 ? "To Customer" : " Rcv. From Mahajon"}</h5>
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
                <th style={{ width: "160px" }}>
                  {entityType ==1 ?"Customer":entityType == 2 ? "WholeSaler" : "Mahajon"}*
                </th>
                <th style={{ width: "140px" }}>Amount(₹)*</th>
                <th style={{ width: "140px" }}>Interest(%)*</th>
                <th style={{ width: "160px" }}>Cost Center*</th>
                <th style={{ width: "160px" }}>EntryDate*</th>
                <th>Narration</th>
                <th style={{ width: "120px" }}>Opening Entry</th>
              </tr>
            </thead>

            <tbody className="tab-body">
              <tr>
                <td>
                  <i className="bi bi-caret-right-fill"></i>
                </td>
                <td>
                  <SearchableDropDown
                    options={entityType ==1? CustomerOption : entityType == 2 ? WholeSalerOption : MahaJonOption}
                    handleChange={OnChangeHandler}
                    selectedVal={wholesalerloan?.WholeSalerID}
                    label={"WholeSalerID"}
                    placeholder={
                      entityType == 1 ?
                        "--Select Customer--" :
                      entityType == 2
                        ? "--Select WholeSaler--"
                        : "--Select Mahajon--"
                    }
                    key={2}
                    defaultval={-1}
                    width={"160px"}
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
                    InputStyle={{  padding: "5px 8px", width: "120px" }}
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
                    InputStyle={{  padding: "5px 8px", width: "100%" }}
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
                    InputStyle={{  padding: "5px 8px", width: "100%" }}
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
                    InputStyle={{  padding: "5px 8px", width: "100%" }}
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
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3">
          <Table
            tab={filteredData || []}
            Col={Column}
            OnChangeHandler={OnChangeHandler}
            isLoading={isLoadingWholeSalerLoanList}
            height={"85vh"}
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
