"use client";

import { Row, Col, Button } from "react-bootstrap";
import Table from "../../Component/Table";
import SelectOption from "../../Component/SelectOption";
import { useEffect, useMemo, useRef, useState } from "react";
import useFetchWallet from "../../store/ShowStore/useFetchWallet";
import useAddAdjustEntry from "../../store/AddStore/useAddAdjustEntry";
import useFetchLotNoNotran from "../../store/ShowStore/useFetchLotNoNotran";
import { toast } from "react-toastify";
import moment from "moment";
import "./Adjust.css";
import { useNavigate } from "react-router-dom";

function ReceiveInterest({
  CalculateData = [[]],
  custId,
  onSave,
  onClose,
  entityType,
  showReceiveInterest,
  fineInterestCode,
}) {
  const recInputref = useRef(null);
  const navigate = useNavigate();
  const [narration, setNarration] = useState("");
  const [selectedLot, setSelectedLot] = useState("");
  const [principalAmount, setPrincipalAmount] = useState(0);

  // Zustand store for fetching lot data
  const {
    LotNoNoTranList,
    isLoadingLotNoNoTran,
    fetchLotNoNoTranList,
    ClearLotNoNoTranList,
  } = useFetchLotNoNotran();

  const lotNolist = useMemo(() => {
    let lotVal = [{ Name: "--Select Lot No--", Value: -1 }];
    let lotList = LotNoNoTranList.map((item) => ({
      Name: `${item?.LotNo}`,
      Value: item?.LotNo,
    }));
    return [...lotVal, ...lotList];
  }, [LotNoNoTranList]);

  // usestate
  const [data, setData] = useState({
    LotNo: "",
    RcvAmt: 0,
    RcvAmtPayMode: 1,
    refundAmt: 0,
    RefundAmtPayMode: 1,
    walletBal: 0,
    totalPaid: 0,
    BalAmt: 0,
    gridData: [],
    narration: "",
    today: moment().format("YYYY-MM-DD"),
    Cust_Type: entityType,
    FineId: fineInterestCode,
  });
console.log(data,"Data");
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

  // Grid1 columns
  const gridColumns = [
    { headername: "Lot No", fieldname: "lotNo", type: "text", width: "120px" },
    { headername: "Srl", fieldname: "srl", type: "text", width: "80px" },
    {
      headername: "Srl_Prn",
      fieldname: "srl_Prn",
      type: "text",
      width: "80px",
    },
    {
      headername: "Principal Amount",
      fieldname: "principalCr",
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

  // Fetch lot data when customer ID changes
  useEffect(() => {
    if (entityType) {
      fetchLotNoNoTranList({ Cust_Type: entityType });
    }

    return () => {
      ClearLotNoNoTranList();
    };
  }, [custId, entityType]);

  // Updated OnChangeHandler for LotNo
  const OnChangeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    const Regex = {
      RcvAmt: /^\d{0,10}(\.\d{0,2})?$/,
      refundAmt: /^\d{0,10}(\.\d{0,2})?$/,
    };
    const arr = Object.keys(Regex);

    if (key === "LotNo") {
      // Find the selected Lot's details
      const selectedLot = LotNoNoTranList.find((item) => item.LotNo === value);
      const principalAmt = selectedLot ? selectedLot.Update_Prn_Rcv : 0;

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

      setSelectedLot("");
      setPrincipalAmount(0);

      // Redirect after 3 seconds
      timeid = setTimeout(() => {
        ClearStateAdjustEntryAdd();
        clearWalletList();
        navigate("/auth/adjust/view", {
          state: { custId, customertype: entityType },
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

  useEffect(() => {
    setTimeout(() => {
      if (recInputref.current && showReceiveInterest) {
        recInputref.current.focus();
      }
    }, 200);
  }, [showReceiveInterest]);

  // grid1 data
  useEffect(() => {
    if (Array.isArray(CalculateData)) {
      const arr = CalculateData?.map((item) => {
        let obj = {};
        if (Array?.isArray(item)) {
          item?.forEach((element) => {
            if (element?.interfaceName == "Total") {
              obj = {
                ...element,
                // Format interest and principal to 2 decimals
                interestCr: Number.parseFloat(element?.interestCr || 0).toFixed(
                  2
                ),
                principalCr: Number.parseFloat(
                  element?.principalCr || 0
                ).toFixed(2),
              };
              obj.TotPaidAmt = (
                Number(element?.interestCr) + Number(element?.principalCr)
              ).toFixed(2);
            }
          });
        }
        return obj;
      });
      setData((prev) => ({ ...prev, gridData: arr }));
    }
  }, [CalculateData]);

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

  // 1. Update Balance Calculation Effect
  useEffect(() => {
    const principal = Number(data.LotPrnAmt) || 0;
    const received = Number(data.RcvAmt) || 0;
    const wallet = Number(data.walletBal) || 0;
    const totalPaid = Number(data.totalPaid) || 0;
    const refund = Number(data.refundAmt) || 0;

    const balance = principal + received + wallet - totalPaid - refund;

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
  ]);

  // set narration
  useEffect(() => {
    setData({ ...data, narration: narration });
  }, [narration]);
  // 3. Add Refund Validation
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

  return (
    <Row>
      <Col s={12} sm={12} md={12} lg={12} xl={12}>
        {/* <div className="mb-3">
          <label className="form-label">Select Lot No</label>
          <select
            className="form-select"
            value={selectedLot}
            onChange={handleLotChange}
            disabled={isLoadingLotNoNoTran}
          >
            <option value="">Select Lot No</option>
            {LotNoNoTranList &&
              LotNoNoTranList.map((lot, index) => (
                <option key={index} value={lot.lotNo}>
                  {lot.lotNo}
                </option>
              ))}
          </select>
        </div> */}

        {selectedLot && (
          <div className="mb-3">
            <label className="form-label">Principal Amount</label>
            <input
              type="text"
              className="form-control"
              value={principalAmount}
              readOnly
            />
          </div>
        )}
      </Col>

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
                <th
                  style={{
                    backgroundColor: "rgb(127, 236, 184)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Cust Bal Amt Adjust
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
                  <SelectOption
                    OnSelect={OnChangeHandler}
                    PlaceHolder={"Select Lot No"}
                    SName={"LotNo"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={data?.LotNo}
                    Soptions={lotNolist}
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
                    // ref={showReceiveInterest ? recInputref : null}
                    disabled
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
                    disabled={
                      data?.RcvAmt + data?.walletBal - data?.totalPaid < 0
                    }
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
      <Col xs={12} sm={9} md={9} lg={10} xl={11}>
        <div className="d-flex flex- justify-content-start align-items-center mt-1 mb-2">
          <label className="py-1">Narration &nbsp;&nbsp;</label>
          <textarea
            as="textarea"
            placeholder="Enter here..."
            value={narration}
            rows={2}
            style={{
              width: "100%",
              borderRadius: "5px",
              border: "1px solid lightgrey",
              padding: "8px",
              fontSize: "16px",
              transition: "all 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid #4CAF50"; // Green border on focus
              e.target.style.boxShadow = "0 0 5px rgba(76, 175, 80, 0.5)"; // Subtle green glow
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid lightgrey"; // Reset border on blur
              e.target.style.boxShadow = "none"; // Remove glow
            }}
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>
      </Col>
      <Col xs={12} sm={3} md={3} lg={2} xl={1}>
        <div className="d-flex justify-content-sm-end justify-content-xs-center align-items-center my-2">
          <Button
            onClick={handleSave}
            disabled={
              !data.LotNo || // Require LotNo selection
              Number(data.BalAmt) < 0 || // Negative balance not allowed
              (Number(data.refundAmt) > 0 &&
                Number(data.RcvAmt) +
                  Number(data.walletBal) -
                  Number(data.totalPaid) <=
                  0)
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
