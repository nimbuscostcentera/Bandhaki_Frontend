import { Row, Col, Button } from "react-bootstrap";
// import EstimateTable from "../../Component/EstimateTable";
import Table from "../../Component/Table";
import SelectOption from "../../Component/SelectOption";
import { useEffect, useRef, useState } from "react";
import useFetchWallet from "../../store/ShowStore/useFetchWallet";
import useAddAdjustEntry from "../../store/AddStore/useAddAdjustEntry";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import "./Adjust.css";
import {useNavigate} from "react-router-dom"
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
  //usestate
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
    Cust_Type: 1,
    FineId: fineInterestCode,
  });

  //api function call of wallet
  const { WalletBalance, fetchWallet, isWalletLoading, clearWalletList } =
    useFetchWallet();
  //api function call of adjust entry
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
  //onChange Handler
  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let Regex = {
      RcvAmt: /^\d{0,10}(\.\d{0,2})?$/,
      refundAmt: /^\d{0,10}(\.\d{0,2})?$/,
    };
    let arr = Object.keys(Regex);
    if (arr.includes(key) && Regex[key]?.test(value)) {
      setData({ ...data, [key]: value });
    } else if (arr.includes(key) === false) {
      setData({ ...data, [key]: value });
    }
  };
  //Submit Handler
  const handleSave = (e) => {
    e.preventDefault();
    let calArray = [];
    let totarray = [];
    CalculateData.forEach((subArr) => {
      let arr = subArr.filter((item, ind) => {
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
        totarray[0]?.interestCr !== totarray[0]?.interestDr &&
        totarray[0]?.principalCr !== 0 &&
        totarray[0]?.principalCr !== "" &&
        totarray[0]?.principalCr !== null &&
        totarray[0]?.principalCr !== undefined
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
        Cust_Type:entityType,
        today: moment().format("YYYY-MM-DD"),
      });
    }
  };
  //toaster controller
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
        FineId:fineInterestCode||0,
      });

      // Redirect after 3 seconds
      timeid = setTimeout(() => {
         ClearStateAdjustEntryAdd();
         clearWalletList();
        navigate("/auth/adjust/view", { state: { custId, customertype: entityType } });
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

  //set wallet balance
  useEffect(() => {
    setData({ ...data, walletBal: parseFloat(WalletBalance||0).toFixed(2)});
  }, [isWalletLoading, WalletBalance, custId]);

  useEffect(() => {
    setTimeout(() => {
      if (recInputref.current && showReceiveInterest) {
        recInputref.current.focus();
      }
    }, 200);
  }, [showReceiveInterest]);

  //grid1 data
  useEffect(() => {
    if (Array.isArray(CalculateData)) {
      let arr = CalculateData?.map((item) => {
        let obj = {};
        if (Array?.isArray(item)) {
          item?.forEach((element) => {
            if (element?.interfaceName == "Total") {
              obj = { ...element };
              obj.TotPaidAmt =
                Number(element?.interestCr) + Number(element?.principalCr);
            }
          });
        }
        return obj;
      });
      setData((prev) => ({ ...prev, gridData: arr }));
    }
  }, [CalculateData]);

  //set total paid
  useEffect(() => {
    let tot = 0;
    if (Array.isArray(data?.gridData)) {
      let arr = data?.gridData;
      arr?.forEach((item) => {
        tot = tot + item?.TotPaidAmt;
      });
    }
    setData((prev) => ({ ...prev, totalPaid: (tot||0).toFixed(2) }));
 
  }, [data?.gridData]);

  //Cust Balance Amt Adjust
  useEffect(() => {
    let amt = 0;
    amt =
      Number(data?.RcvAmt) +
      Number(data?.walletBal) -
      Number(data?.totalPaid) -
      Number(data?.refundAmt);

   setData((prev) => ({ ...prev, BalAmt: (amt||0).toFixed(2)}));
   
  }, [data?.RcvAmt, data?.refundAmt, data?.walletBal, data?.totalPaid]);
  //set narration
  useEffect(() => { 
    setData({ ...data, narration: narration });
  }, [narration]);

  console.log(data)
  return (
    <Row>
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
                {/* <th
                  style={{
                    backgroundColor: "rgb(235, 142, 154)",
                    color: "black",
                    border: "1px solid rgb(11, 82, 158)",
                    textAlign: "center",
                  }}
                >
                  Wallet Balance
                </th> */}
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
                {/* <td>N/A</td>
                <td>N/A</td> */}
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
                {/* <td>{data?.walletBal}</td> */}
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
        {/* <EstimateTable
          columns={grid1Columns||[]}
          deleteRow={false}
          handleChange={() => {}}
          isDelete={false}
          rows={grid1Data||[]}
        /> */}
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
              !(
                (data?.totalPaid == 0 &&
                  // data?.RcvAmt == 0 &&
                  data?.BalAmt == 0 &&
                  data?.walletBal != 0 &&
                  data?.refundAmt != 0) ||
                (data?.totalPaid != 0 && data?.BalAmt >= 0)
              )
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
