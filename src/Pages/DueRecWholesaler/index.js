"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.css";
import { Row, Col, Container, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown/index";
import useFetchDueRcvWh from "../../store/ShowStore/useFetchDueRcvWh";
import InputBox from "../../Component/InputBox";
import useAddDueRcvWh from "../../store/AddStore/useAddDueRcvWh";
import { useMemo } from "react";
import useFetchLotNoNotran from "../../store/ShowStore/useFetchLotNoNotran";
import "./duerecive.css";
import useFetchCust from "../../store/ShowStore/useFetchCust";
import useFetchAdjustIdWithCredit from "../../store/ShowStore/useFetchAdjustIdWithCredit";
function DueRecWholesaler() {
  // ----------------------------------State hooks---------------------------------------//
  const [inputAmounts, setInputAmounts] = useState({});
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const entityType =
    searchParams.get("type") === "wholeseller"
      ? 2
      : searchParams.get("type") === "customer"
      ? 1
      : 3;
  const rendering = searchParams.get("opening");

  const [filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
    name: null,
    amtWithId: null,
  });

  const [wholeseller, setWholeseller] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState(-1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState({
    View1: false,
    View2: false,
  });
  const [narration, setNarration] = useState("");
  const [adjustIdWithCreditList, setAdjustIdWithCreditList] = useState([]);
  // ----------------------------------------API hooks--------------------------------------//
  const { user, CompanyID } = useFetchAuth();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();
  const { fetchMahajonData, MahajonList } = useFetchMahajon();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const {
    DueRcvwhList,
    isDueRcvwhListLoading,
    isDueRcvwhListError,
    ClearstateDueRcvwhList,
    searchDueRcvwhHeader,
    DueRcvwhErrMsg,
    isDueRcvSucc,
  } = useFetchDueRcvWh();
  const {
    ClearStateDueRcvWhAdd,
    DueRcvWhAdd,
    DueRcvWhAddError,
    isDueRcvWhAddLoading,
    DueRcvWhAddSuccess,
  } = useAddDueRcvWh();

  const {
    LotNoNoTranList,
    isLoadingLotNoNoTran,
    fetchLotNoNoTranList,
    ClearLotNoNoTranList,
    errorLotNoNoTran,
  } = useFetchLotNoNotran();

  const {
    ClearstateGetAdjIdCredit,
    GetAdjIdCreditViewErrMsg,
    isGetAdjIdCreditViewListError,
    isGetAdjIdCreditViewListLoading,
    GetAdjIdCreditViewList,
    fetchGetAdjIdCredit,
  } = useFetchAdjustIdWithCredit();
  //--------------------------------------functions-------------------------------//
  // In the calculateInterestAmount function:
  const calculateInterestAmount = (wholesalerId, dueamt) => {
    const data = inputAmounts[wholesalerId];
    // First check if there's a manually entered interest amount
    if (data?.manualInterest !== undefined) {
      return Number.parseFloat(data.manualInterest) || 0;
    }
    // Otherwise calculate from rate and months
    if (!data?.interestRate || !data?.months || !dueamt) {
      return 0;
    }
    const principal = Number.parseFloat(dueamt) || 0;
    // console.log(principal, "principal");
    const rate = Number.parseFloat(data.interestRate) || 0;
    const months = Number.parseFloat(data.months) || 0;
    return (principal * rate * months) / 100;
  };

  // Calculate balance amount
  const calculateBalance = (wholesalerId, dueAmount) => {
    const data = inputAmounts[wholesalerId];
    const paymentAmount =
      entityType === 3
        ? -1 * Number(data?.amount) || 0
        : Number(data?.amount) || 0;
    const interestAmount = calculateInterestAmount(wholesalerId, dueAmount);
    const refundAmount =
      entityType === 3
        ? -1 * Number(data?.refundAmount) || 0
        : Number(data?.refundAmount) || 0;
    const lotPrnAmt =
      entityType === 3
        ? -1 * Number(data?.LotPrnAmt) || 0
        : Number(data?.LotPrnAmt) || 0;
    // console.log(lotPrnAmt, "lotPrnAmt");
    return (
      dueAmount + interestAmount - paymentAmount + refundAmount - lotPrnAmt
    );
  };

  // Add to inputAmounts state updates
  const handleLotChange = (wholesalerId, lotNo) => {
    const selected = LotNoNoTranList.find((lot) => lot.LotNo === lotNo);
    setInputAmounts((prev) => ({
      ...prev,
      [wholesalerId]: {
        ...prev[wholesalerId],
        LotNo: lotNo,
        LotPrnAmt: selected?.Update_Prn_Rcv || 0,
      },
    }));
  };

  const handleWholesalerChange = (e) => {
    const value = e.target.value;
    setSelectedEntityId(value);
    setFilters((prev) => ({ ...prev, name: value }));
  };

  const performSearch = () => {
    searchDueRcvwhHeader({
      WholesalerId: selectedEntityId,
      Cust_Type: entityType,
      CompanyID: user?.CompanyID,
      AdjustidCredit : filters?.amtWithId
    });
  };

  const renderTable = () => (
    <div
      className="table-responsive"
      style={{
        width: "100%",
        overflowX: "auto", // Enable horizontal scrolling
        height: "35vh", // Keep your desired height
        border: "1px solid lightgrey",
      }}
    >
      {isDueRcvwhListLoading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredData.length > 0 && filteredData[0]?.DueAmount != 0 ? (
        <table
          style={{
            width: "100%",
            overflow: "auto",
          }}
        >
          <thead className="tab-head">
            <tr className="table-secondary ">
              <th
                scope="col"
                style={{ minWidth: "70px", maxWidth: "100px", zIndex: 999 }}
              >
                Sl No.
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Name
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Own Date
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Adj. Date
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                O.Amount. (₹)
              </th>

              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Lot No
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                L. Amt. (₹)
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Int. %
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Months
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Int. Amt. (₹)
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                {entityType === 3 ? "Paid Amt. (₹)" : "Rcv. Amt. (₹)"}
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                {entityType === 3 ? "Paid Amt. Mode" : "Rcv. Amt. Mode"}
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                {entityType === 3 ? "Rcv. Amt. (₹)" : "Ref. Amt. (₹)"}
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                {entityType === 3 ? "Rcv. Amt. Mode" : "Ref. Amt. Mode"}
              </th>
              <th scope="col" style={{ minWidth: "150px", maxWidth: "200px" }}>
                Balance (₹)
              </th>

              <th scope="col" style={{ maxWidth: "90px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="tab-body">
            {filteredData.map((item, index) => (
              <tr key={item.id || index}>
                <td style={{ zIndex: 999 }}>{index + 1}</td>
                <td>{item.WholesalerName}</td>
                <td>{item.ownDate}</td>
                <td>{item.AdjustDate}</td>
                <td>₹{item.DueAmount?.toFixed(2)}</td>

                <td>
                  <SearchableDropDown
                    options={lotNolist}
                    selectedVal={inputAmounts[item.WholesalerID]?.LotNo || ""}
                    handleChange={(e) =>
                      handleLotChange(item.WholesalerID, e.target.value)
                    }
                    placeholder="Select Lot"
                    label={"LotNo"}
                    defaultval={-1}
                    width={"100%"}
                    directSearch={true}
                  />
                </td>
                <td>
                  <InputBox
                    type="number"
                    value={inputAmounts[item.WholesalerID]?.LotPrnAmt || ""}
                    readOnly
                    InputStyle={{ padding: "6px 8px", width: "80%" }}
                    placeholder="Lot Principal"
                  />
                </td>

                <td>
                  <InputBox
                    type="number"
                    placeholder="Interest %"
                    label="interestRate"
                    Name="interestRate"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setInputAmounts((prev) => ({
                          ...prev,
                          [item.WholesalerID]: {
                            ...prev[item.WholesalerID],
                            interestRate: Number.parseFloat(value) || 0,
                            manualInterest: undefined, // Clear manual entry
                          },
                        }));
                      }
                    }}
                    value={inputAmounts[item.WholesalerID]?.interestRate || ""}
                    InputStyle={{ padding: "6px 8px", width: "80%" }}
                    Icon={<i className="bi bi-percent"></i>}
                    step="0.01"
                    onBlur={(e) => {
                      const value = Number.parseFloat(e.target.value) || 0;
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          interestRate: Number.parseFloat(value.toFixed(2)),
                        },
                      }));
                    }}
                  />
                </td>
                <td>
                  <InputBox
                    type="number"
                    placeholder="Months"
                    label="months"
                    Name="months"
                    onChange={(e) => {
                      const value = e.target.value.split(".")[0];
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          months: Number.parseInt(value) || 0,
                          manualInterest: undefined, // Clear manual entry
                        },
                      }));
                    }}
                    value={inputAmounts[item.WholesalerID]?.months || ""}
                    InputStyle={{ padding: "6px 8px", width: "80%" }}
                    Icon={<i className="bi bi-calendar"></i>}
                    min="0"
                    step="1"
                  />
                </td>
                <td>
                  <InputBox
                    type="number"
                    placeholder="Interest Amt"
                    label="interestAmount"
                    Name="interestAmount"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^-?\d*\.?\d{0,2}$/.test(value)) {
                        setInputAmounts((prev) => ({
                          ...prev,
                          [item.WholesalerID]: {
                            ...prev[item.WholesalerID],
                            manualInterest: Number.parseFloat(value) || 0,
                            // Clear calculated interest when manually editing
                            calculatedInterest: undefined,
                          },
                        }));
                      }
                    }}
                    value={
                      inputAmounts[item.WholesalerID]?.manualInterest !==
                      undefined
                        ? inputAmounts[item.WholesalerID]?.manualInterest
                        : inputAmounts[item.WholesalerID]
                            ?.calculatedInterest !== undefined
                        ? inputAmounts[item.WholesalerID]?.calculatedInterest
                        : calculateInterestAmount(
                            item?.WholesalerID,
                            item?.DueAmount
                          ).toFixed(2)
                    }
                    InputStyle={{ padding: "6px 8px", width: "80%" }}
                    Icon={<i className="bi bi-cash"></i>}
                    step="0.01"
                  />
                </td>
                <td>
                  <InputBox
                    type="number"
                    placeholder="Enter amount"
                    label="paymentAmount"
                    Name="paymentAmount"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setInputAmounts((prev) => ({
                          ...prev,
                          [item.WholesalerID]: {
                            ...prev[item.WholesalerID],
                            amount: Number.parseFloat(e.target.value) || 0,
                          },
                        }));
                      }
                    }}
                    value={inputAmounts[item.WholesalerID]?.amount || ""}
                    InputStyle={{ padding: "6px 8px", width: "80%" }}
                    Icon={<i className="bi bi-cash"></i>}
                  />
                </td>
                <td>
                  <SelectOption
                    OnSelect={(e) => {
                      const selectedValue = Number.parseInt(e.target.value);
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          rcvmode: selectedValue,
                        },
                      }));
                    }}
                    PlaceHolder={"Select Payment Mode"}
                    SName={"rcvmode"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={inputAmounts[item.WholesalerID]?.rcvmode || ""}
                    Soptions={[
                      { Name: "Cash", Value: 1 },
                      { Name: "UPI", Value: 2 },
                      { Name: "Bank Transfer", Value: 3 },
                      { Name: "Adjust", Value: 3 },
                    ]}
                  />
                </td>

                <td>
                  <InputBox
                    type="number"
                    placeholder="Refund amount"
                    label="refundAmount"
                    Name="refundAmount"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setInputAmounts((prev) => ({
                          ...prev,
                          [item.WholesalerID]: {
                            ...prev[item.WholesalerID],
                            refundAmount:
                              Number.parseFloat(e.target.value) || 0,
                          },
                        }));
                      }
                    }}
                    value={inputAmounts[item.WholesalerID]?.refundAmount || ""}
                    InputStyle={{
                      padding: "6px 8px",
                      width: "100%",
                    }}
                    Icon={<i className="bi bi-arrow-return-left"></i>}
                    step="0.01"
                    disabled={
                      calculateBalance(item.WholesalerID, item.DueAmount) >= 0
                    }
                  />
                </td>

                <td>
                  <SelectOption
                    OnSelect={(e) => {
                      const selectedValue = Number.parseInt(e.target.value);
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          refmode: selectedValue,
                        },
                      }));
                    }}
                    PlaceHolder={"Select Payment Mode"}
                    SName={"refmode"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={inputAmounts[item.WholesalerID]?.refmode || ""}
                    Soptions={[
                      { Name: "Cash", Value: 1 },
                      { Name: "UPI", Value: 2 },
                      { Name: "Bank Transfer", Value: 3 },
                    ]}
                  />
                </td>
                <td>
                  <div
                    style={{
                      padding: "6px 8px",
                      backgroundColor:
                        calculateBalance(item.WholesalerID, item.DueAmount) < 0
                          ? "#f8d7da"
                          : calculateBalance(
                              item.WholesalerID,
                              item.DueAmount
                            ) === 0
                          ? "#d1edff"
                          : "#d4edda",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      minHeight: "32px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      fontWeight: "500",
                      color:
                        calculateBalance(item.WholesalerID, item.DueAmount) < 0
                          ? "#721c24"
                          : calculateBalance(
                              item.WholesalerID,
                              item.DueAmount
                            ) === 0
                          ? "#055160"
                          : "#155724",
                      width: "100%",
                    }}
                  >
                    ₹
                    {calculateBalance(
                      item.WholesalerID,
                      item.DueAmount
                    ).toFixed(2)}
                    {(() => {
                      const balance = calculateBalance(
                        item.WholesalerID,
                        item.DueAmount
                      );

                      if (balance == 0) return " (Settled)";

                      if (entityType == 3) {
                        return balance > 0 ? " (Overpaid)" : " (Pending)";
                      } else {
                        return balance < 0 ? " (Overpaid)" : " (Pending)";
                      }
                    })()}
                  </div>
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() =>
                      handleSave(item.WholesalerID, item.DueAmount)
                    }
                    // disabled={
                    //   saving || !inputAmounts[item.WholesalerID]?.amount
                    // }
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-muted py-3">No records found.</div>
      )}
    </div>
  );
  // console.log(filteredData[0]?.RelationLinkID, "RelationLinkID");
  // console.log(filteredData[0]?.RelationLinkTranCode, "RelationLinkID");
  // Handlers
  const handleSave = async (wholesalerId, dueAmount) => {
    const amount = inputAmounts[wholesalerId]?.amount;
    const rcvmode = inputAmounts[wholesalerId]?.rcvmode;
    const refmode = inputAmounts[wholesalerId]?.refmode;
    const interestRate = inputAmounts[wholesalerId]?.interestRate;
    const months = inputAmounts[wholesalerId]?.months;
    const interestAmount = calculateInterestAmount(wholesalerId, dueAmount);
    const refundAmount = inputAmounts[wholesalerId]?.refundAmount;
    const own_date = filteredData[0]?.ownDate;
    const adjust_date = filteredData[0]?.AdjustDate;
    const balance = calculateBalance(wholesalerId, dueAmount);
    setSaving(true);
    try {
      // API call to save payment
      DueRcvWhAdd({
        WholesalerID: wholesalerId,
        Amount: amount,
        DueAmount: dueAmount,
        Cust_Type: entityType,
        refmode: refmode || 1,
        rcvmode: rcvmode || 1,
        InterestRate: interestRate || null,
        Months: months || null,
        InterestAmount: interestAmount || null,
        RefundAmount: refundAmount || null,
        Balance: typeof balance === "number" ? balance.toFixed(2) : null,
        LotPrn: inputAmounts[wholesalerId]?.LotPrnAmt || null,
        Lot: inputAmounts[wholesalerId]?.LotNo || null,
        own_date: own_date,
        adjust_date: adjust_date,
        narration: narration,
        RelationLinkID: filteredData[0]?.RelationLinkID,
        RelationLinkTranCode: filteredData[0]?.RelationLinkTranCode
      });
      } catch (error) {
      toast.error("Failed to save payment");
    } finally {
      setSaving(false);
    }
  };
  const handleAdjustIdChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, amtWithId: value }));

    // Call API to fetch due receivables based on the selected adjustId
    if (value && value !== -1) {
      searchDueRcvwhHeader({
        WholesalerId: selectedEntityId,
        Cust_Type: entityType,
        CompanyID: user?.CompanyID,
        AdjustidCredit: value,
      });
    }
  };
  // ----------------------------------------Effects--------------------------------------

  // In the useEffect for calculations:
  useEffect(() => {
    if (filteredData) {
      const updatedAmounts = {};

      filteredData.forEach((item) => {
        const data = inputAmounts[item.WholesalerID];
        if (
          data?.manualInterest === undefined &&
          data?.interestRate !== undefined &&
          data?.months !== undefined &&
          item.DueAmount
        ) {
          const calculatedInterest =
            (item.DueAmount * data.interestRate * data.months) / 100;

          updatedAmounts[item.WholesalerID] = {
            ...data,
            calculatedInterest: calculatedInterest.toFixed(2),
          };
        }
      });

      // Only update if there are changes
      if (Object.keys(updatedAmounts).length > 0) {
        setInputAmounts((prev) => ({
          ...prev,
          ...updatedAmounts,
        }));
      }
    }
  }, [filteredData]); // ✅ Removed inputAmounts from dependencies

  useEffect(() => {
    if (entityType == 2) {
      fetchWSomrData({ CompanyID: user?.CompanyID });
    } else if (entityType == 3) {
      fetchMahajonData({ Cust_Type: entityType, CompanyID });
    } else if (entityType == 1) {
      fetchCustomrData({ Cust_Type: entityType, CompanyID });
    }
    fetchLotNoNoTranList({ Cust_Type: entityType });
    return () => {
      setFilteredData([]);
      setSearchTerm("");
      setInputAmounts({});
      ClearLotNoNoTranList();
    };
  }, [entityType]);

  // useEffect(() => {
  //   setInputAmounts({});
  //   setSelectedEntityId(-1);
  //   ClearstateDueRcvwhList();
  // }, [entityType, selectedEntityId]);

  useEffect(() => {
    // console.log(selectedEntityId);
    if (
      selectedEntityId !== -1 &&
      selectedEntityId !== null &&
      selectedEntityId !== undefined
    ) {
      // Fetch adjust ID with credit data when customer is selected
      ClearstateGetAdjIdCredit();
      fetchGetAdjIdCredit({
        custId: selectedEntityId,
        Cust_Type: entityType,
        CompanyID: user?.CompanyID,
      });
      // performSearch();
    }
  }, [selectedEntityId]);

  useEffect(() => {
    if (
      GetAdjIdCreditViewList?.length > 0 &&
      !isGetAdjIdCreditViewListLoading
    ) {
      const formattedAdjustIds = GetAdjIdCreditViewList.map((item) => ({
        label: `${item.RelationLinkID} - ₹${item.CreditAmt?.toFixed(2)} : ${
          item.FirstDate
        }`,
        value: `${item.RelationLinkID}:${item.RelationLinkTranCode}`,
        creditAmount: item.CreditAmt,
      }));
      setAdjustIdWithCreditList(formattedAdjustIds);
    } else {
      setAdjustIdWithCreditList([]);
    }
  }, [GetAdjIdCreditViewList, isGetAdjIdCreditViewListLoading]);

  //whole saler load in hook
  useEffect(() => {
    if (WholeSellerList?.length > 0) {
      const formattedWholesellers = WholeSellerList?.map((wholeseller) => ({
        label: wholeseller?.Name,
        value: wholeseller?.ID,
      }));
      setWholeseller(formattedWholesellers);
    }
  }, [WholeSellerList]);

  //toaster for due rcv
  useEffect(() => {
    // console.log(isDueRcvwhListError, isDueRcvSucc, isDueRcvWhAddLoading);
    if (isDueRcvwhListError && !isDueRcvWhAddLoading) {
      toast.error(DueRcvwhErrMsg, { position: "top-right", autoClose: 3000 });
      setFilteredData(null);
    } else if (isDueRcvSucc) {
      setFilteredData(DueRcvwhList);
    }
    ClearstateDueRcvwhList();
  }, [
    isDueRcvwhListError,
    isDueRcvSucc,
    DueRcvWhAddSuccess,
    isDueRcvWhAddLoading,
  ]);

  // Modify useEffect for handling DueRcvWhAddSuccess
  useEffect(() => {
    if (DueRcvWhAddError) {
      toast.error(DueRcvWhAddError, { position: "top-right", autoClose: 3000 });
    }
    if (DueRcvWhAddSuccess) {
      toast.success("Payment saved successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      performSearch(); // Refetch data after successful save
      fetchLotNoNoTranList({ Cust_Type: entityType }); // Add this line
      // Clear input fields for the selected wholesaler
      setInputAmounts((prev) => {
        const newState = { ...prev };
        delete newState[selectedEntityId];
        return newState;
      });
      setNarration("");
    }
    ClearStateDueRcvWhAdd();
  }, [DueRcvWhAddError, DueRcvWhAddSuccess]);

  const mjon = useMemo(() => {
    if (MahajonList?.length > 0) {
      const formattedMahajon = MahajonList.map((mjon) => ({
        label: mjon.Name,
        value: mjon.ID,
      }));
      return formattedMahajon;
    } else {
      return [];
    }
  }, [MahajonList]);

  // Memoize lot list
  const lotNolist = useMemo(() => {
    if (errorLotNoNoTran) {
      return [];
    }
    return LotNoNoTranList?.map((lot) => ({
      label: lot.LotNo,
      value: lot.LotNo,
    }));
  }, [LotNoNoTranList, errorLotNoNoTran]);

  const customer = useMemo(() => {
    return CustomerList.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [CustomerList]);

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2" style={{ fontSize: "18px" }}>
                OutStanding
                {entityType == 2
                  ? " Wholesaler"
                  : entityType == 1
                  ? " Customer"
                  : " Mahajon"}
              </h5>
            </div>
            <div className="d-flex justify-content-between flex-wrap align-items-end gap-2">
              <div style={{ width: "300px" }}>
                <SearchableDropDown
                  options={
                    entityType == 2
                      ? wholeseller
                      : entityType == 1
                      ? customer
                      : mjon
                  }
                  handleChange={handleWholesalerChange}
                  selectedVal={filters?.name}
                  label={"name"}
                  placeholder={
                    entityType == 2
                      ? "--Select Wholesaler--"
                      : entityType == 1
                      ? "--Select Customer--"
                      : "--Select Mahajon--"
                  }
                  defaultval={-1}
                  width={"100%"}
                />
              </div>
              <div style={{ width: "300px" }}>
                <SearchableDropDown
                  options={adjustIdWithCreditList}
                  handleChange={handleAdjustIdChange}
                  selectedVal={filters?.amtWithId}
                  label={"amtWithId"}
                  placeholder={"--Select Credit Amount with Id--"}
                  defaultval={-1}
                  width={"100%"}
                />
              </div>
            </div>
          </div>
          <hr className="my-1" />
        </Col>

        <Col xl={12}>
          <div
            className="table-box"
            style={{ height: "35vh", border: "1px solid lightgrey" }}
          >
            {filteredData?.length > 0 ? (
              renderTable()
            ) : isDueRcvwhListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                {filters?.amtWithId != null
                  ? "No results found. Try a different search."
                  : ` Select a ${
                      entityType == 1
                        ? "Customer"
                        : entityType == 2
                        ? "Wholesaler"
                        : "Mahajon"
                    } & Credit with Id to find entries.`}
              </div>
            )}
          </div>
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
            disabled={filteredData?.length > 0 ? false : true}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default DueRecWholesaler;
