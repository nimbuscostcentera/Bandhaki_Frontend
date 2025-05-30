"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../Component/Table/table.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./openentry.css";
import BongCalender from "../../Component/BongCalender";
import InputBox from "../../Component/InputBox";
import SearchableDropDown from "../../Component/SearchableDropDown/index";
import ReusableModal from "../../Component/Modal";
import EstimateTable from "../../Component/EstimateTable";
import moment from "moment";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddOpenEntry from "../../store/AddStore/useAddOpenEntry";
import useFetchCust from "../../store/ShowStore/useFetchCust";
import useFetchCostCenter from "../../store/ShowStore/useFetchCostCenter";
import useFetchWareHouse from "../../store/ShowStore/useFetchWareHouse";
import useFetchCheckLot from "../../store/ShowStore/useFetchCheckLot";
import useFetchGoldRate from "../../store/ShowStore/useFetchGoldRate";
import { useSearchParams } from "react-router-dom";
import useFetchWS from "../../store/ShowStore/useFetchWS";

const TransferWareHouse = () => {
  //---------------------------fetch data by zunstand store api call---------------------

  const { CompanyID } = useFetchAuth();
  const { CostCenterList, fetchCostCenter } = useFetchCostCenter();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();
  const { GoldRateError, isGoldRateLoading, GoldRateList, fetchGoldRate } =
    useFetchGoldRate();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const { WareHouseList, fetchWareHouse } = useFetchWareHouse();
  const {
    ClearStateOpenEntryAdd,
    InsertOpenEntry,
    OpenEntryError,
    isOpenEntryLoading,
    OpenEntrySuccess,
  } = useAddOpenEntry();

  const { CheckLotError, isCheckLotLoading, isCheckLotList, fetchCheckLot } =
    useFetchCheckLot();
  //---------------------------------other states----------------------------------------
  const [searchParams] = useSearchParams();
  const trancode = searchParams.get("trancode");
  const entityType = searchParams.get("type") === "customer" ? 1 : 2;
  const [trackchange, setTrackChange] = useState({
    index: 0,
    value: 0,
    name: 0,
  });
  // --------------------------------useref-----------------------------------
  const dateInputRef = useRef(null);
  const srlInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);
  const prevDetailRowsLength = useRef(0);
  const srlRefs = useRef([]);
  const prn_row = {
    interestPercentage: null,
    srl_Prn: null,
    date: null,
    amount: null,
    paymentMode: 1,
    reminderWadah: null,
    actualWadah: null,
  };

  //--------------------------------------useState----------------------------------

  const [detailRows, setDetailRows] = useState([]);
  const [headerData, setHeaderData] = useState({
    date: "",
    packetNo: "",
    costCenter: "",
    id_costcenter: "",
    id_customer: "",
    lotNo: "",
    customerName: "",
    warehouse: "",
    id_warehouse: "",
    CompanyID: CompanyID,
    Cust_Type: entityType,
    TranCode: trancode,
  });
  const newRow = {
    srl: 1, // Auto-assigned SRL
    description: "",
    grossWeight: "",
    percentage: "",
    netWeight: "",
    rate: 0,
    valuation: "",
    principalAmount: "",
    principalDetails: [],
    ...headerData,
  };
  // console.log(headerData, "Header data");
  // console.log(trancode, "Trancode data");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(null);
  const [rows, setRows] = useState([{ rowid: 1, id: 1, ...prn_row }]);
  const [view, setView] = useState(false);

  //--------------------------------functions--------------------------------
  function onfocusinput() {
    if (srlPrnInputRef.current) {
      srlPrnInputRef.current.focus(); // ✅ Focus on the date field when page loads
    }
  }
  // Handle Header Form Input Change
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_costcenter") {
      const selectedCostCenter = CostCenterList.find(
        (costCenter) => costCenter.ID === value
      );
      if (selectedCostCenter) {
        setHeaderData({
          ...headerData,
          costCenter: selectedCostCenter.CODE,
          [name]: value,
        });
      }
    } else if (name === "id_customer") {
      const selectedList = entityType == 1 ? CustomerList : WholeSellerList;
      const selectedCust = selectedList.find(
        (customer) => customer.ID === value
      );
      if (selectedCust) {
        setHeaderData({
          ...headerData,
          customerName: selectedCust.Name,
          [name]: value,
        });
      }
    } else if (name === "id_warehouse") {
      const selectedWarehouse = WareHouseList.find(
        (warehouse) => warehouse.ID === value
      );
      if (selectedWarehouse) {
        setHeaderData({
          ...headerData,
          warehouse: selectedWarehouse?.CODE,
          [name]: value,
        });
      }
    } else if (
      name !== "id_costcenter" ||
      name !== "id_customer" ||
      name !== "id_warehouse"
    ) {
      setHeaderData({ ...headerData, [name]: value });
    }
  };
  const addDetailRow = async () => {
    if (!isHeaderFilled) {
      toast.error("Please fill all the header fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if ((trancode === "0RC" || trancode === "0RW") && !headerData.lotNo) {
      toast.error("Lot Number is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      console.log("hi");
      if (trancode === "0RC" || trancode === "0RW") {
        const lotCheck = await fetchCheckLot({
          LotNo: headerData.lotNo,
          packetNo: headerData.packetNo,
          id_costcenter: headerData.id_costcenter,
          Cust_Type: headerData.Cust_Type,
        });

        if (!lotCheck?.success) {
          toast.error(lotCheck?.response || "Invalid Lot Number", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
      }
      await fetchGoldRate({
        CompanyID: CompanyID,
        today: moment().format("YYYY-MM-DD"),
      });
      // Automatically assign the next sequential SRL number
      const nextSrl =
        detailRows.length > 0 ? (detailRows.length + 1).toString() : "1";
      let obj = {
        ...newRow,
        srl: nextSrl,
        rate: GoldRateList[0]?.GOLD_RATE || 0,
      };
      setDetailRows((prev) => [...prev, obj]);
    } catch (error) {
      // Handle unexpected errors (like network issues)
      toast.error(error.message || "Failed to validate Lot Number", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  //setgoldrate
  useEffect(() => {
    console.log("hui");
    if (GoldRateList?.length > 0) {
      let arr = [...detailRows];
      let len = arr?.length;
      let obj = { ...arr[len - 1] };
      obj.rate = GoldRateList[0]?.GOLD_RATE || 0;
      arr[len - 1] = obj;
      setDetailRows(arr);
    }
  }, [isGoldRateLoading, GoldRateList, detailRows?.length]);

  console.log(trackchange);
  // Handle Detail Form Input Change
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    let updatedRows = [...detailRows];

    // Validation patterns
    const amountRegex = /^(\d*\.?\d{0,2})?$/;
    const weightRegex = /^(\d*\.?\d{0,3})?$/;

    // Validate input based on field type
    let isValid = true;
    if (name === "grossWeight" || name === "netWeight") {
      isValid = weightRegex.test(value);
    } else if (
      ["rate", "percentage", "principalAmount", "valuation"].includes(name)
    ) {
      isValid = amountRegex.test(value);
    }

    if (!isValid) return;

    // Update the changed field
    updatedRows[index][name] = value;
    setDetailRows(updatedRows);

    // Track the change to trigger calculations
    setTrackChange({
      index,
      name,
      value,
    });
  };

  useEffect(() => {
    if (trackchange.index === undefined || !trackchange.name) return;

    const { index, name, value } = trackchange;
    const updatedRows = [...detailRows];
    const row = updatedRows[index];

    // Reset dependent fields when their dependencies change
    switch (name) {
      case "rate":
        row.valuation = "";
        row.percentage = "";
        break;
      case "netWeight":
        row.valuation = "";
        row.percentage = "";
        break;
      case "grossWeight":
        row.valuation = "";
        row.netWeight = "";
        row.percentage = "";
        break;
      case "percentage":
        row.netWeight = "";
        row.valuation = "";
        break;
      case "valuation":
        row.percentage = "";
        break;
    }

    // Get current values (use updated values where available)
    const grossWeight =
      name === "grossWeight"
        ? parseFloat(value) || 0
        : parseFloat(row.grossWeight) || 0;
    const netWeight =
      name === "netWeight"
        ? parseFloat(value) || 0
        : parseFloat(row.netWeight) || 0;
    const percentage =
      name === "percentage"
        ? parseFloat(value) || 0
        : parseFloat(row.percentage) || 0;
    const rate =
      name === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;

    let calculatedNetWeight, recalculatedPercentage, calculatedPercentage;
    // Calculate netWeight if grossWeight and percentage are provided
    if (grossWeight > 0 && percentage > 0 && name !== "netWeight") {
      calculatedNetWeight = grossWeight * (percentage / 100);
      row.netWeight = calculatedNetWeight.toFixed(2);

      // Recalculate percentage based on the new netWeight (to ensure consistency)
      recalculatedPercentage = (calculatedNetWeight / grossWeight) * 100;
      row.percentage = recalculatedPercentage;
      row.valuation = ((calculatedNetWeight || netWeight) * rate).toFixed(2);
    }

    // Calculate percentage if grossWeight and netWeight are provided
    if (grossWeight > 0 && netWeight > 0 && name !== "percentage") {
      calculatedPercentage =
        (calculatedNetWeight || netWeight / grossWeight) * 100;
      row.percentage = calculatedPercentage.toFixed(2);
    }

    // Calculate valuation if netWeight and rate are provided
    if (netWeight > 0 && rate > 0) {
      const valuation = (calculatedNetWeight || netWeight) * rate;
      row.valuation = valuation.toFixed(2);
    }

    setDetailRows(updatedRows);
  }, [trackchange]);
  // Delete a row from the Detail Form
  const deleteDetailRow = (index) => {
    // Remove the row at the specified index
    const updatedRows = detailRows.filter((_, i) => i !== index);

    // Resequence the SRL numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.srl = (i + 1).toString();
    });

    setDetailRows(updatedRows);
  };
  // Modal functions
  const handleOpenModal = (index) => {
    setCurrentDetailIndex(index);
    const prn = detailRows[index].principalDetails || [];
    prn_row.date = headerData.date;

    prn_row.srl_Prn = prn?.length + 1;
    setRows(prn.length <= 0 ? [{ rowid: 1, id: 1, ...prn_row }] : prn);
    setShowModal(true);
    setTimeout(() => {
      onfocusinput();
    }, 150);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  // Updated handleDetailModalChange to match EstimateTable's expected signature
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    // Find the column definition
    const column = detailColumns.find((col) => col.key === colKey);

    // If the column is marked as readOnly, don't update it
    if (column && column.readOnly) {
      return;
    }

    const regex = {
      amount: /^[0-9]+(\.[0-9]{1,2})?$/,
    };
    const value = e.target.value;
    const updatedRows = [...rows];
    const obj = { ...updatedRows[rowIndex] };
    if (regex[colKey] && regex[colKey].test(value)) {
      obj[colKey] = value;
    } else if (!regex[colKey]) {
      obj[colKey] = value;
    }
    updatedRows[rowIndex] = obj;
    setRows(updatedRows);
  };
  const addRow = () => {
    // Automatically assign the next sequential srl_Prn number
    const nextSrlPrn = rows.length > 0 ? (rows.length + 1).toString() : 1;
    const newRow = {
      id: rows.length + 1, // Changed from rowid to id to match EstimateTable
      rowid: rows.length + 1, // Keep rowid for backward compatibility
      srl_Prn: nextSrlPrn, // Auto-assigned srl_Prn
      date: rows.length == 0 ? headerData?.date : "",
      amount: "",
      paymentMode: 1, // Default value
      reminderWadah: "",
      actualWadah: "",
      interestPercentage: "",
    };
    setRows([...rows, newRow]);
  };
  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.rowid !== id);

    // Resequence the srl_Prn numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.srl_Prn = (i + 1).toString();
    });

    setRows(updatedRows);
  };
  const saveItem = () => {
    const isValid = rows.every(
      (row) =>
        row.date &&
        row.amount &&
        row.paymentMode &&
        row.reminderWadah &&
        row.actualWadah &&
        row.interestPercentage
    );

    if (!isValid) {
      toast.error("All fields are mandatory for principal details", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check for duplicate dates with different amounts
    const dateMap = new Map();
    for (const row of rows) {
      if (dateMap.has(row.date) && dateMap.get(row.date) !== row.amount) {
        toast.error("For a single date, only a single amount is allowed", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      dateMap.set(row.date, row.amount);
    }

    // Check for duplicate Lot No + srl + srl_Prn
    const uniqueKeys = new Set();
    for (const row of rows) {
      const key = `${headerData.lotNo}_${detailRows[currentDetailIndex].srl}_${row.srl_Prn}`;
      if (uniqueKeys.has(key)) {
        toast.error(
          `Duplicate entry found for Lot No + SRL + SRL_PRN: ${key}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        return;
      }
      uniqueKeys.add(key);
    }

    // Calculate total principal amount
    const totalAmount = rows.reduce(
      (sum, row) => sum + Number.parseFloat(row.amount || 0),
      0
    );

    // Update the detail row with principal details and total amount
    const updatedDetailRows = [...detailRows];
    updatedDetailRows[currentDetailIndex].principalDetails = rows; // This line stores the modal data
    updatedDetailRows[currentDetailIndex].principalAmount =
      totalAmount.toFixed(2);

    setDetailRows(updatedDetailRows); // Update state
    setShowModal(false);
  };
  const handleShow = () => {
    setView(true);
  };
  const handleClose1 = () => {
    setView(false);
  };
  const handleSave = () => {
    // Validate valuation > principal amount
    for (let i = 0; i < detailRows.length; i++) {
      if (!detailRows[i].principalDetails?.length) {
        toast.error(`Please add principal details for row ${i + 1}`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    // Create payload where the details array is inside the header object
    const payload = {
      // header: {
      ...headerData,
      Cust_Type: entityType,
      TranCode: trancode,
      details: detailRows.map((row) => ({
        // Detail-specific fields
        srl: row.srl,
        description: row.description,
        grossWeight: row.grossWeight,
        percentage: row.percentage,
        netWeight: row.netWeight,
        rate: row.rate,
        valuation: row.valuation,
        principalAmount: row.principalAmount,
        principalDetails: row.principalDetails.map((pd) => ({
          // Principal detail fields
          srl_Prn: pd.srl_Prn,
          date: pd.date,
          amount: pd.amount,
          paymentMode: pd.paymentMode,
          reminderWadah: pd.reminderWadah,
          actualWadah: pd.actualWadah,
          interestPercentage: pd.interestPercentage,
        })),
        // Add composite key if needed
        compositeKey: `${headerData.lotNo}_${row.srl}`,
      })),
      // },
    };
    InsertOpenEntry({
      payload,
    });
  };
  const handleSave1 = (BengaliDate, EnglishDate) => {
    setHeaderData({ ...headerData, date: BengaliDate });
  };
  //------------------------------------------variables and constants----------------------------

  // Check if header is filled
  const obj = { ...headerData };
  const { packetNo, ...rest } = obj;

  // Create an array of entries to check each key and value
  const entries = Object.entries(rest);
  const isHeaderFilled = entries.every(([key, val], index) => {
    // Skip CompanyID check
    if (key === "CompanyID") return true;

    // Skip lotNo check if trancode is not "0RC" or "0RW"
    if (key === "lotNo" && !(trancode === "0RC" || trancode === "0RW"))
      return true;

    return val !== "" && val !== null && val !== undefined;
  });
  // Dropdown options
  const costcenter = useMemo(() => {
    return CostCenterList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [CostCenterList]);

  const customer = useMemo(() => {
    return CustomerList.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [CustomerList]);

  const wholeseller = useMemo(() => {
    return WholeSellerList.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [WholeSellerList]);

  const warehouselist = useMemo(() => {
    return WareHouseList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [WareHouseList]);

  // Modal columns configuration - Updated to match EstimateTable's expected format
  const detailColumns = [
    {
      label: "SRL_PRN",
      key: "srl_Prn",
      type: "text",
      width: "65px",
      readOnly: true, // Make it read-only
    },
    {
      label: "Date",
      key: "date",
      type: "date",
      width: "150px",
      banglaDate: true,
      LostFocus: (rowIndex, val) => {
        if (rowIndex !== 0) {
          const checkdate2 = Number.parseInt(
            val.toString().replace(/-/g, ""),
            10
          );
          const checkdate1 = Number.parseInt(
            headerData.date.toString().replace(/-/g, ""),
            10
          );
          if (checkdate2 < checkdate1) {
            toast.error(
              "2nd time Principle Rcv Date should be greater than to opening date"
            );
          }
        }
      },
    },
    {
      label: "Amount",
      key: "amount",
      type: "number",
      width: "140px",
      proprefs: true,
    },
    {
      label: "Payment Mode*",
      key: "paymentMode",
      AutoSearch: true,
      SearchLabel: "paymentMode",
      SearchValue: "value",
      PlaceHolder: "Select Payment Mode",
      data: [
        { label: "Cash", value: 1 },
        { label: "Bank", value: 2 },
        { label: "UPI", value: 3 },
      ],
      width: "180px",
    },
    {
      label: "Reminder Wadah",
      key: "reminderWadah",
      type: "text",
      width: "140px",
    },
    {
      label: "Actual Wadah",
      key: "actualWadah",
      type: "text",
      width: "140px",
    },
    {
      label: "Interest%",
      key: "interestPercentage",
      type: "number",
      width: "110px",
    },
  ];

  //-----------------------------------state Control by useEffect--------------------------

  // Add this useEffect hook to focus on newly added row
  useEffect(() => {
    if (detailRows.length > prevDetailRowsLength.current) {
      const lastIndex = detailRows.length - 1;
      srlRefs.current[lastIndex]?.focus();
    }
    prevDetailRowsLength.current = detailRows.length;
  }, [detailRows.length]);
  useEffect(() => {
    if (OpenEntrySuccess) {
      toast.success("Entry Added Successfully");
      setHeaderData({
        date: "",
        packetNo: "",
        costCenter: "",
        id_costcenter: "",
        id_customer: "",
        lotNo: "",
        customerName: "",
        warehouse: "",
        id_warehouse: "",
        CompanyID: CompanyID,
      });
      setDetailRows([]);
    }

    if (OpenEntryError) toast.error(OpenEntryError);

    ClearStateOpenEntryAdd();
  }, [OpenEntrySuccess, OpenEntryError, ClearStateOpenEntryAdd]);
  // Mock data fetching (replace with actual API calls)
  useEffect(() => {
    fetchCostCenter({ CompanyID, Type: entityType });

    if (entityType == 1) {
      fetchCustomrData({ CompanyID });
    } else {
      //wholeseller fetching
      fetchWSomrData({ CompanyID: CompanyID });
    }
    fetchWareHouse({ CompanyID });
    if (dateInputRef.current) {
      dateInputRef.current.focus(); // ✅ Focus on the date field when page loads
    }

    setHeaderData({
      date: "",
      packetNo: "",
      costCenter: "",
      id_costcenter: "",
      id_customer: "",
      lotNo: "",
      customerName: "",
      warehouse: "",
      id_warehouse: "",
      CompanyID: CompanyID,
      Cust_Type: entityType,
      TranCode: trancode,
    });
    setRows([{ rowid: 1, id: 1, ...prn_row }]);
    setDetailRows([]);
  }, [entityType, trancode]);
  useEffect(() => {
    onfocusinput();
  }, [rows.length]);
  useEffect(() => {
    if (srlInputRef.current) {
      srlInputRef.current.focus(); // ✅ Focus on the date field when page loads
    }
  }, [detailRows.length]);
  //gold rate api call
  useEffect(() => {
    if (detailRows?.length > 0) {
      fetchGoldRate({
        CompanyID: CompanyID,
        today: moment().format("YYYY-MM-DD"),
      });
    }
  }, [detailRows?.length]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", width: "100%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <h5 style={{ fontSize: "18px" }}>
              {trancode === "0RC" || trancode === "0RW"
                ? "Opening"
                : "Recive/Dafa"}{" "}
              Entry of {entityType == 1 ? "Customer" : "Wholeseller "}{" "}
            </h5>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div>
            <h6>Header Table</h6>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            className="table-box"
            style={{
              width: "98%",
              overflow: "auto",
            }}
          >
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
                  <th>Date*</th>
                  <th>Packet No</th>
                  <th>Cost Center*</th>
                  {trancode === "0RC" || trancode === "0RW" ? (
                    <th>Lot No*</th>
                  ) : null}

                  <th>{entityType == 1 ? "Customer" : "WholeSeller"} Name*</th>
                  <th>Warehouse*</th>
                </tr>
              </thead>

              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <InputBox
                      ref={dateInputRef}
                      type="text"
                      placeholder="yyyy-mm-dd"
                      label="date"
                      Name="date"
                      onChange={handleHeaderChange}
                      Icon={<i className="bi bi-calendar"></i>}
                      SearchButton={true}
                      SearchIcon={<i className="bi bi-calendar"></i>}
                      SearchHandler={handleShow}
                      maxlen={100}
                      value={headerData?.date || ""}
                      onFocusChange={() => {
                        if (!headerData?.date) {
                        } else {
                          const regex =
                            /^(?:14|15)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[0-2])$/;
                          if (!regex.test(headerData?.date)) {
                            toast.error(
                              "Invalid Date Format.It should be YYYY-MM-DD.Also make sure day and month number contain 0 if less than 10."
                            );
                          }
                        }
                      }}
                      // isdisable
                    />
                    <BongCalender
                      view={view}
                      handleclose={handleClose1}
                      handleSave={handleSave1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Packet No."
                      className="input-cell"
                      name="packetNo"
                      value={headerData?.packetNo || ""}
                      onChange={handleHeaderChange}
                      type="text"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={costcenter}
                      handleChange={handleHeaderChange}
                      selectedVal={headerData?.id_costcenter}
                      label={"id_costcenter"}
                      placeholder={"--Select Cost Center--"}
                      key={2}
                      defaultval={-1}
                      width={"100%"}
                      directSearch={true}
                    />
                  </td>
                  {trancode === "0RC" || trancode === "0RW" ? (
                    <td>
                      <input
                        placeholder="Lot No"
                        className="input-cell"
                        name="lotNo"
                        value={headerData?.lotNo || ""}
                        onChange={handleHeaderChange}
                        type="text"
                        maxLength={100}
                        style={{ width: "100%" }}
                      />
                    </td>
                  ) : null}

                  <td>
                    <SearchableDropDown
                      options={entityType == 1 ? customer : wholeseller}
                      handleChange={handleHeaderChange}
                      selectedVal={headerData?.id_customer || ""}
                      label={"id_customer"}
                      placeholder={
                        entityType == 1
                          ? "--Select Customer--"
                          : "--Select Wholeseller--"
                      }
                      key={2}
                      defaultval={-1}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={warehouselist}
                      handleChange={handleHeaderChange}
                      selectedVal={headerData?.id_warehouse || ""}
                      label={"id_warehouse"}
                      placeholder={"--Select Warehouse--"}
                      key={2}
                      defaultval={-1}
                      width={"100%"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <hr className="my-1" />
          <div className="d-flex justify-content-between">
            <div className="mt-2">
              <h6>Detail Form</h6>
            </div>
            <Button
              onClick={addDetailRow}
              className="py-1 px-2"
              disabled={!isHeaderFilled || isCheckLotLoading}
            >
              {isCheckLotLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i className="bi bi-plus-lg"></i>
              )}
            </Button>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            className="table-box"
            style={{ height: "50vh", border: "1px solid lightgrey" }}
          >
            <table
              style={{
                width: "100vw",
                overflow: "auto",
              }}
            >
              <thead className="tab-head">
                <tr>
                  <th
                    style={{
                      padding: "3px 10px",
                      borderBottom: "1px solid lightgrey",
                      width: "50px",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>SRL*</th>
                  <th>Description</th>
                  <th>Gross Wt*</th>
                  <th>Percentage</th>
                  <th>Net Wt*</th>
                  <th>Rate</th>
                  <th>Valuation*</th>
                  <th>Principal Amt*</th>
                  {/* <th>Date</th>
                  <th>Packet No</th>
                  <th>Cost Center</th>
                  <th>Lot No</th>
                  <th>{entityType == 1 ? "Customer" : "Wholeseller"} Name</th>
                  <th>Warehouse</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                {detailRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <i className="bi bi-caret-right-fill"></i>
                    </td>
                    <td style={{ width: "50px" }}>{row.srl}</td>
                    <td>
                      <input
                        ref={srlInputRef}
                        placeholder="Description"
                        className="input-cell form-input"
                        name="description"
                        value={row.description}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="text"
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ width: "130px" }}>
                      <input
                        required
                        placeholder="Gross Weight"
                        className="input-cell"
                        name="grossWeight"
                        value={row.grossWeight}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="number"
                        style={{ width: "100%" }}
                      />
                    </td>

                    <td style={{ width: "130px" }}>
                      <input
                        placeholder="Percentage"
                        className="input-cell"
                        name="percentage"
                        value={row.percentage}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="number"
                        step="0.01"
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ width: "130px" }}>
                      <input
                        required
                        placeholder="Net Weight"
                        className="input-cell"
                        name="netWeight"
                        value={row.netWeight}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="number"
                        step="0.01"
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ width: "130px" }}>
                      <input
                        placeholder="Rate"
                        className="input-cell"
                        name="rate"
                        value={row?.rate?.toFixed(2)}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="number"
                        step="0.01"
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ width: "130px" }}>
                      <input
                        placeholder="Valuation"
                        className="input-cell"
                        name="valuation"
                        value={row.valuation}
                        onChange={(e) => handleDetailChange(index, e)}
                        type="number"
                        step="0.01"
                        style={{ width: "100%" }}
                        required
                      />
                    </td>
                    <td style={{ width: "170px" }}>
                      <div className="d-flex align-items-center">
                        <input
                          placeholder="Principal Amount"
                          className="input-cell"
                          name="principalAmount"
                          value={row.principalAmount}
                          type="number"
                          step="0.01"
                          style={{ width: "100%" }}
                          readOnly
                        />

                        <Button
                          variant={
                            row.principalDetails?.length > 0
                              ? "success"
                              : "outline-primary"
                          }
                          size="sm"
                          className="ms-1"
                          onClick={() => handleOpenModal(index)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                      </div>
                    </td>
                    {/* <td style={{ padding: "5px 8px", width: "100px" }}>
                      {row.date}
                    </td>
                    <td style={{ padding: "5px 8px", width: "100px" }}>
                      {row.packetNo}
                    </td>
                    <td style={{ padding: "5px 8px", width: "100px" }}>
                      {row.costCenter}
                    </td>
                    <td style={{ padding: "5px 8px", width: "100px" }}>
                      {row.lotNo}
                    </td>
                    <td style={{ padding: "5px 8px", width: "150px" }}>
                      {row.customerName}
                    </td>
                    <td style={{ padding: "5px 8px", width: "100px" }}>
                      {row.warehouse}
                    </td> */}
                    <td style={{ width: "80px" }}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteDetailRow(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-end align-items-center mt-2">
            <Button
              variant="success"
              onClick={handleSave}
              style={{ marginRight: "5px" }}
              disabled={detailRows.length === 0}
            >
              <i className="bi bi-floppy-fill"></i> Save
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal for Principal Amount Details */}
      <ReusableModal
        show={showModal}
        Title={"Principal Amount Details"}
        isPrimary={true}
        isSuccess={true}
        handleClose={handleClose}
        handlePrimary={saveItem}
        handleSuccess={addRow}
        SuccessButtonName={"Add Row"}
        PrimaryButtonName={"Save"}
        key={4}
        body={
          <div>
            <EstimateTable
              columns={detailColumns}
              rows={rows || [[{ rowid: 1, id: 1, ...prn_row }]]}
              handleChange={handleDetailModalChange}
              deleteRow={deleteRow}
              isDelete={true}
              id={"rowid"}
              toaster={toast}
              tableWidth={"80vw"}
              priorityref={srlPrnInputRef}
            />
          </div>
        }
      />
    </Container>
  );
};

export default TransferWareHouse;
