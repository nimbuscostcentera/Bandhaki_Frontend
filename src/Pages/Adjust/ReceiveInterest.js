"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import { Row, Col, Button } from "react-bootstrap";

import Table from "../../Component/Table";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown";

import useFetchWallet from "../../store/ShowStore/useFetchWallet";
import useAddAdjustEntry from "../../store/AddStore/useAddAdjustEntry";
import useFetchLotNoNotran from "../../store/ShowStore/useFetchLotNoNotran";

import "./Adjust.css";
import useEditCredit from "../../store/UpdateStore/useEditCredit";
import useFetchAdminSetUp from "../../store/ShowStore/useFetchAdminSetUp";

function ReceiveInterest({
  LotNo,
  CalculateData = [[]],
  custId,
  onSave,
  onClose,
  entityType,
  showReceiveInterest,
  fineInterestCode,
}) {
  // console.log(custId,);
  //-----------------------------------hooks------------------------------------//
  const recInputref = useRef(null);
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [data, setData] = useState({
    LotNo: "",
    LotPrnAmt: 0,
    RcvAmt: 0,
    RcvAmtPayMode: 1,
    refundAmt: 0,
    RefundAmtPayMode: 1,
    discountAmt: 0,
    creditAmt: 0,
    walletBal: 0,
    totalPaid: 0,
    BalAmt: 0,
    gridData: [],
    narration: "",
    today: moment().format("YYYY-MM-DD"),
    Cust_Type: entityType,
    FineId: fineInterestCode,
    validation: false,
    isPartial: false,
    isAllPrnPaid: false,
  });
  // ------------------------------Zustand store for fetching lot data---------------------------------//
  const {
    LotNoNoTranList,
    isLoadingLotNoNoTran,
    fetchLotNoNoTranList,
    ClearLotNoNoTranList,
  } = useFetchLotNoNotran();
  // api function call of wallet
  const { WalletBalance, fetchWallet, isWalletLoading, clearWalletList } =
    useFetchWallet();

  // api function call of adjust entry
  const {
    isAdjustEntryLoading,
    AdjustEntrySuccess,
    ClearStateAdjustEntryAdd,
    AdjustEntryError,
    AdjustEntryAdd,
  } = useAddAdjustEntry();


    const {
      AdminSetUp,
      fetchAdminSetUp,
    } = useFetchAdminSetUp();
  
  
    const { CreditEditSuccess,
    } = useEditCredit();

  //---------------------------------------------function-----------------------------------------//

  // Updated OnChangeHandler for LotNo
  const OnChangeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    const Regex = {
      RcvAmt: /^\d{0,10}(\.\d{0,2})?$/,
      LotPrnAmt: /^\d{0,10}(\.\d{0,2})?$/,
      refundAmt: /^\d{0,10}(\.\d{0,2})?$/,
    };
    const arr = Object.keys(Regex);

    if (key === "LotNo") {
      // Find the selected Lot's details
    const selectedLot = LotNoNoTranList.find((item) => item.LotNo === value);
    let principalAmt = 0;
    if (selectedLot) {
      principalAmt = selectedLot.Update_Prn_Rcv;
    }

      // Update both LotNo and LotPrnAmt in the data state
      setData((prev) => ({
        ...prev,
        [key]: value,
        LotPrnAmt: principalAmt.toFixed(2), // Format to 2 decimals
      }));
      setPrincipalAmount(principalAmt); // Update local state if needed
    }

    // Handle other inputs
    if (arr.includes(key) && Regex[key]?.test(value)) {
      setData((prev) => ({ ...prev, [key]: value }));
    } else if (!arr.includes(key)) {
      setData((prev) => ({ ...prev, [key]: value }));
    }
  };
  // Submit Handler
  const handleSave = (e) => {
    e.preventDefault();
    const calArray = [];
    const totarray = [];
    CalculateData.forEach((subArr) => {
      const arr = subArr.filter((item, ind) => {
        if (ind != 0) {
          if (item?.isToggled === true) {
            return item;
          }
        } else {
          return item;
        }
      });
      subArr.filter((item) => {
        if (item?.interfaceName == "Total") {
          totarray.push(item);
        }
      });

      calArray.push(arr);
    });
    let flag = 0;

    for (let i = 0; i < totarray.length; i++) {
      if (
        totarray[0]?.interestCr > 0 &&
        totarray[0]?.interestDr > 0 &&
        totarray[0]?.principalCr > 0 &&
        totarray[0]?.interestCr < totarray[0]?.interestDr
      ) {
        flag = 1;
        break;
      }
    }
    if (flag == 1) {
      toast.dismiss();
      toast.error(
        "Once you pay all the interest you are eligible to pay the principal"
      );
    } else {
      console.log(calArray, "Calarray");
      AdjustEntryAdd({
        ...data,
        CalculateData: calArray,
        CustomerID: custId,
        Cust_Type: entityType,
        today: moment().format("YYYY-MM-DD"),
        principalAmount: Number.parseFloat(principalAmount),
      });
    }
  };

  //-------------------------------------------useEffect-----------------------------------------//

  // Fetch lot data when customer ID changes
  useEffect(() => {
    if (entityType) {
      fetchLotNoNoTranList({ Cust_Type: entityType });
    }

    return () => {
      ClearLotNoNoTranList();
    };
  }, [custId, entityType]);
  // toaster controller
  useEffect(() => {
    toast.dismiss();
    let timeid;

    if (AdjustEntrySuccess && !isAdjustEntryLoading && !AdjustEntryError) {
      toast.success(AdjustEntrySuccess, {
        position: "top-right",
        autoClose: 3000, // Ensures toast stays for 3 seconds
      });

      setData({
        LotNo: "",
        LotPrnAmt:0,
        RcvAmt: 0,
        RcvAmtPayMode: "Cash",
        refundAmt: 0,
        RefundAmtPayMode: "Cash",
        walletBal: 0,
        totalPaid: 0,
        BalAmt: 0,
        gridData: [],
        FineId: fineInterestCode || 0,
      });

      setPrincipalAmount(0);
      ClearLotNoNoTranList();

      clearWalletList();

      // Redirect after 3 seconds
      timeid = setTimeout(() => {
        ClearStateAdjustEntryAdd();
        navigate("/auth/adjust/view", {
          state: { custId, customertype: entityType },
          // replace: true,
        });
      }, 3000);
    }

    if (AdjustEntryError && !isAdjustEntryLoading && !AdjustEntrySuccess) {
      toast.error(AdjustEntryError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    return () => clearTimeout(timeid);
  }, [isAdjustEntryLoading, AdjustEntrySuccess, AdjustEntryError]);
  //set customer id
  useEffect(() => {
    if (
      custId?.length !== 0 &&
      custId !== undefined &&
      custId !== -1 &&
      custId !== null &&
      custId !== "" &&
      entityType
    ) {
      fetchWallet({ CustomerID: custId, Cust_Type: entityType });
      setData((prev) => ({
        ...prev,
        CustomerID: custId,
      }));
    }
    if (fineInterestCode) {
      setData((prev) => ({ ...prev, FineId: fineInterestCode }));
    }
  }, [custId, fineInterestCode]);
  // set wallet balance
  useEffect(() => {
    setData({
      ...data,
      walletBal: Number.parseFloat(WalletBalance || 0).toFixed(2),
    });
  }, [isWalletLoading, WalletBalance, custId]);
  //manage focus
  useEffect(() => {
    setTimeout(() => {
      if (recInputref.current && showReceiveInterest) {
        recInputref.current.focus();
      }
    }, 200);
  }, [showReceiveInterest]);
  // grid1 data
  useEffect(() => {
    const arr = [];
    let isvalidate = false,
      isPartial = false;
    if (Array.isArray(CalculateData)) {
      CalculateData?.forEach((item) => {
        let obj = {};
        if (Array?.isArray(item)) {
          item?.forEach((element) => {
            if (
              element?.interfaceName == "Total" &&
              (element?.interestCr > 0 || element?.principalCr > 0)
            ) {
              obj = {
                ...element,
                // Format interest and principal to 2 decimals
                interestCr: Number.parseFloat(element?.interestCr || 0).toFixed(
                  2
                ),
                interestDr: Number.parseFloat(element?.interestDr || 0).toFixed(
                  2
                ),
                principalCr: Number.parseFloat(
                  element?.principalCr || 0
                ).toFixed(2),
                principalDr: Number.parseFloat(
                  element?.principalDr || 0
                ).toFixed(2),
              };
              obj.TotPaidAmt = (
                Number(element?.interestCr) + Number(element?.principalCr)
              ).toFixed(2);
              arr.push(obj);
            }
            if (
              isvalidate == false &&
              obj?.principalCr > 0 &&
              ((obj?.interestDr &&
                obj?.interestCr &&
                obj?.interestDr !== obj?.interestCr) ||
                (!obj?.interestDr && !obj?.interestCr))
            ) {
              isvalidate = true;
            }
            if (
              isPartial == false &&
              obj?.principalCr > 0 &&
              obj?.principalDr !== obj?.principalCr
            ) {
              isPartial = true;
            }
          });
        }
      });
    }
    if (isvalidate) {
      toast.error("you can not submit Principal before paying all Interest.");
    }
    setData((prev) => ({
      ...prev,
      gridData: arr,
      validation: isvalidate,
      isPartial: isPartial,
    }));
  }, [CalculateData]);
  //datagrid filter
  useEffect(() => {
    let tot = 0;
    if (Array.isArray(data?.gridData)) {
      data.gridData.forEach((item) => {
        // Convert to number and handle potential NaN values
        const amount = Number(item?.TotPaidAmt) || 0;
        tot += amount;
      });
    }
    // Round to 2 decimal places using toFixed() after addition
    setData((prev) => ({
      ...prev,
      totalPaid: Number(tot.toFixed(2)),
    }));
  }, [data?.gridData]);


   useEffect(() => {
        fetchAdminSetUp({});
      }, [CreditEditSuccess]);
  //Update Balance Calculation Effect
  useEffect(() => {
    const principal = Number(data.LotPrnAmt) || 0;
    const received = Number(data.RcvAmt) || 0;
    const wallet = Number(data.walletBal) || 0;
    const totalPaid = Number(data.totalPaid) || 0;
    const refund = Number(data.refundAmt) || 0;
    const discount = Number(data.discountAmt) || 0;
    const credit = Number(data.creditAmt) || 0;
    const creditAdjust = Number(data.creditAmtAdjust) || 0;

    const balance =
      principal +
      received +
      wallet -
      totalPaid -
      refund +
      discount +
      credit -
      creditAdjust;

    setData((prev) => ({
      ...prev,
      BalAmt: balance.toFixed(2),
    }));
  }, [
    data.LotPrnAmt,
    data.RcvAmt,
    data.walletBal,
    data.totalPaid,
    data.refundAmt,
    data.discountAmt,
    data.creditAmt,
    data.creditAmtAdjust,
  ]);
  // set narration
  useEffect(() => {
    setData({ ...data, narration: narration });
  }, [narration]);
  //Add Refund Validation
  useEffect(() => {
    if (
      Number(data.RcvAmt) + Number(data.walletBal) - Number(data.totalPaid) <=
      0
    ) {
      setData((prev) => ({
        ...prev,
        refundAmt: "0", // Reset refund if not allowed
      }));
    }
  }, [data.RcvAmt, data.walletBal, data.totalPaid]);

  //-----------------------------------------others variables and constant------------------------------------//
  // Modified lotNolist memo
  const lotNolist = useMemo(() => {
    return LotNoNoTranList.filter((item) => !LotNo.includes(item.LotNo)).map(
      (item) => ({
        label: item.LotNo,
        value: item.LotNo,
      })
    );
  }, [LotNoNoTranList, LotNo]);
   useEffect(() => {
     // Check if the currently selected lot number is now in the excluded list
     if (data.LotNo && LotNo && LotNo.includes(data.LotNo)) {
       // Reset LotPrnAmt and principalAmount if the selected lot is now excluded
       setData((prev) => ({
         ...prev,
         LotNo: "",
         LotPrnAmt: 0,
       }));
       setPrincipalAmount(0);
     }
   }, [LotNo, data.LotNo]);
  // Grid1 columns
  const gridColumns = [
    {
      headername: "Lot No",
      fieldname: "lotNo",
      type: "text",
      width: "120px",
    },
    { headername: "Srl", fieldname: "srl", type: "text", width: "80px" },
    {
      headername: "Srl_Prn",
      fieldname: "srl_Prn",
      type: "text",
      width: "80px",
    },
    {
      headername: "Paybale Principal Amt",
      fieldname: "principalDr",
      type: "number",
      width: "150px",
    },
    {
      headername: "Principal Amount",
      fieldname: "principalCr",
      type: "number",
      width: "150px",
    },
    {
      headername: "Payble Interest Amt",
      fieldname: "interestDr",
      type: "number",
      width: "150px",
    },
    {
      headername: "Interest Amount",
      fieldname: "interestCr",
      type: "number",
      width: "150px",
    },
    {
      headername: "Total Paid",
      fieldname: "TotPaidAmt",
      type: "number",
      width: "150px",
    },
  ];
  return (
    <Row className="my-4">
      <Col s={12} sm={12} md={12} lg={12} xl={12}>
        <div
          style={{
            width: "100%",
            overflow: "auto",
            margin: "10px 0px 5px 0px",
          }}
        >
          <table style={{ width: "100%", overflow: "auto" }}>
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "rgb(110, 98, 221)",
                    color: "#000000",
                    border: "1px solid rgb(142, 135, 214)",
                    textAlign: "center",
                  }}
                >
                  Lot No
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(110, 98, 221)",
                    color: "#000000",
                    border: "1px solid rgb(142, 135, 214)",
                    textAlign: "center",
                  }}
                >
                  Principal
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(255, 197, 72)",
                    color: "#000000",
                    border: "1px solid rgb(158, 89, 11)",
                    textAlign: "center",
                  }}
                >
                  Receive Amt*
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(255, 197, 72)",
                    color: "#000000",
                    border: "1px solid rgb(158, 89, 11)",
                    textAlign: "center",
                  }}
                >
                  Payment Mode*
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(199, 177, 245)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Refund Amt*
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(199, 177, 245)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Payment Mode*
                </th>
                {/* <th
                  style={{
                    backgroundColor: "rgb(152, 223, 138)",
                    color: "#000000",
                    border: "1px solid rgb(89, 158, 11)",
                    textAlign: "center",
                  }}
                >
                  Discount Amt
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(152, 223, 138)",
                    color: "#000000",
                    border: "1px solid rgb(89, 158, 11)",
                    textAlign: "center",
                  }}
                >
                  Credit Amount
                </th> */}
                <th
                  style={{
                    backgroundColor: "rgb(127, 236, 184)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Bal Amt Adjust
                </th>
                <th
                  style={{
                    backgroundColor: "rgb(127, 236, 184)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="rcv-tab-body">
              <tr>
                <td>
                  <SearchableDropDown
                    options={lotNolist}
                    handleChange={OnChangeHandler}
                    selectedVal={data?.LotNo}
                    label={"LotNo"}
                    placeholder={"--Select Lot No--"}
                    key={2}
                    defaultval={-1}
                    width={"100%"}
                    directSearch={true}
                  />
                </td>
                <td>
                  <input
                    placeholder="Principal Amount(₹)"
                    className="input-cell"
                    name="LotPrnAmt"
                    value={data?.LotPrnAmt || ""}
                    onChange={OnChangeHandler}
                    type="number"
                    min="0"
                    step="0.01"
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <input
                    placeholder="Receive Amount(₹)"
                    className="input-cell"
                    name="RcvAmt"
                    value={data?.RcvAmt || ""}
                    onChange={OnChangeHandler}
                    type="number"
                    min="0"
                    step="0.01"
                    style={{ width: "100%" }}
                    ref={showReceiveInterest ? recInputref : null}
                  />
                </td>
                <td>
                  <SelectOption
                    OnSelect={OnChangeHandler}
                    PlaceHolder={"Select Payment Mode"}
                    SName={"RcvAmtPayMode"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={data?.RcvAmtPayMode}
                    Soptions={[
                      { Name: "Cash", Value: 1 },
                      { Name: "UPI", Value: 2 },
                      { Name: "Bank Transfer", Value: 3 },
                    ]}
                  />
                </td>
                <td>
                  <input
                    placeholder="Refund Amount(₹)"
                    className="input-cell"
                    name="refundAmt"
                    value={data?.refundAmt || ""}
                    onChange={OnChangeHandler}
                    type="number"
                    min="0"
                    step="0.01"
                    // disabled={
                    //   data?.RcvAmt + data?.walletBal - data?.totalPaid < 0
                    // }
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <SelectOption
                    OnSelect={OnChangeHandler}
                    PlaceHolder={"Select Payment Mode"}
                    SName={"RefundAmtPayMode"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={data?.RefundAmtPayMode}
                    Soptions={[
                      { Name: "Cash", Value: 1 },
                      { Name: "UPI", Value: 2 },
                      { Name: "Bank Transfer", Value: 3 },
                    ]}
                  />
                </td>
                {/* <td>
                  <input
                    placeholder="Discount Amount(₹)"
                    className="input-cell"
                    name="discountAmt"
                    value={data?.discountAmt || ""}
                    onChange={OnChangeHandler}
                    type="number"
                    step="0.01"
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <input
                    placeholder="Credit Amount(₹)"
                    className="input-cell"
                    name="creditAmt"
                    value={data?.creditAmt || ""}
                    onChange={OnChangeHandler}
                    type="number"
                    min="0"
                    step="0.01"
                    style={{ width: "100%" }}
                    disabled={entityType !== "wholesaler"}
                  />
                </td> */}
                <td>{data?.walletBal == 0 ? "-" : data?.walletBal}</td>
                <td>{data?.BalAmt == 0 ? "-" : data?.BalAmt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
        <Table
          Col={gridColumns || []}
          tab={data?.gridData || []}
          isLoading={false}
          isFooter={true}
          grandtotal={data?.totalPaid}
          width={"100%"}
        />
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        <textarea
          placeholder="Narration..."
          value={narration}
          rows={2}
          style={{
            borderRadius: "5px",
            border: "1px solid lightgrey",
            padding: "8px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            outline: "none",
            resize: "none",
            width: "100%",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid #4CAF50";
            e.target.style.boxShadow = "0 0 5px rgba(76, 175, 80, 0.5)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid lightgrey";
            e.target.style.boxShadow = "none";
          }}
          onChange={(e) => setNarration(e.target.value)}
        />
      </Col>
      <Col xs={12} sm={12} md={9} lg={11} xl={11}>
        {/* Second Row: Credit & Discount Amounts */}
        <Row className="mt-3">
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            {/* Discount Amount */}
            <div
              className="d-flex flex-wrap justify-content-start align-items-center"
              style={{ width: "100%" }}
            >
              <label
                className="me-2 mb-0 fw-medium"
                style={{ width: "fit-content" }}
              >
                Discount Amt.(₹):
              </label>
              <div style={{ width: "70%" }}>
                <input
                  style={{ width: "100%" }}
                  placeholder="Discount Amount (₹)"
                  className="form-control"
                  name="discountAmt"
                  value={data?.discountAmt || ""}
                  onChange={OnChangeHandler}
                  type="number"
                  step="0.01"
                />{" "}
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            {/* Credit Amount */}
            <div
              className="d-flex flex-wrap justify-content-start align-items-center"
              style={{ width: "100%" }}
            >
              {(entityType !== 2 && AdminSetUp[0]?.Customer_Access === 1) ||
              (entityType === 2 && AdminSetUp[0]?.WholeSaler_Access === 1) ? (
                <>
                  <label
                    className="me-2 mb-0 fw-medium"
                    style={{ minWidth: "100px" }}
                  >
                    Credit Amt.(₹):
                  </label>
                  <div style={{ width: "70%" }}>
                    <input
                      placeholder="Credit Amount(₹)"
                      className="form-control"
                      name="creditAmt"
                      value={data?.creditAmt || ""}
                      onChange={OnChangeHandler}
                      type="number"
                      min="0"
                      step="0.01"
                      // disabled={entityType !== 2}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={12} sm={3} md={3} lg={1} xl={1}>
        <div className="d-flex justify-content-sm-end justify-content-xs-center align-items-center mt-3">
          <Button
            onClick={handleSave}
            disabled={
              Number(data.BalAmt) < 0 || // Negative balance not allowed
              (Number(data.refundAmt) > 0 &&
                Number(data.RcvAmt) +
                  Number(data.walletBal) -
                  Number(data.totalPaid) <=
                  0) ||
              data?.validation ||
              CalculateData?.length == 0
            }
          >
            Save
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default ReceiveInterest;
