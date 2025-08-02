import {useState,useEffect} from 'react'
import { Button } from 'react-bootstrap';
import ReusableModal from "../../Component/ReusableModal";
import {toast,ToastContainer} from 'react-toastify';
import useFetchLotWiseItemFrMahajon from '../../store/ShowStore/useFetchLotWiseItemFrMahajon';
import PrnTakenfrmMahajon from './PrnTakenfrmMahajon';
import useFetchAdminSetUp from "../../store/ShowStore/useFetchAdminSetUp";
import useFetchAuth from '../../store/Auth/useFetchAuth';
function EntryDetailMahajon({
  SetItemDetails,
  entrydate,
  LotNo, 
  successreturn,
  headerData,
  selectedLots,
  setSelectedLots,
}) {
  //--------------------------------------API--------------------------------------//
  const { CompanyID, user } = useFetchAuth();
  const {
    LotWiseItemFrMahajon,
    isLoadingLotWiseItemFrMahajon,
    isErrorLotWiseItemFrMahajon,
    isSuccesLotWiseItemFrMahajon,
    CLearLotWiseItemFrMahajon,
    fetchLotWiseItemFrMahajon,
  } = useFetchLotWiseItemFrMahajon();
  const { AdminSetUp, ClearAdminSetUp, fetchAdminSetUp, isAdminSetUpSuccess } =
    useFetchAdminSetUp();
  //--------------------------------------Hooks--------------------------------------//
  const prn_row = {
    interestPercentage: null,
    srl_Prn: 1,
    date: entrydate,
    amount: null,
    paymentMode: 1,
    reminderWadah: null,
    actualWadah: AdminSetUp[0]?.Days||null,
  };

  // console.log(selectedLots, "selectedLots");
  const [Principle, setPrinciple] = useState([{ id: 1, rowid: 1, ...prn_row }]);
  const [maxValuation, setMaxValuation] = useState(0);
  const [detail, setDetails] = useState([]);
  const [trackchange, setTrackChange] = useState({
    index: 0,
    value: 0,
    name: 0,
    SelectedLotCount: 0,
  });
  const [PrnView, setPrnView] = useState(false);
  //--------------------------------------Function--------------------------------------//
  const handlePrnSave = (rows, totalprn, index) => {
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
      toast.error(
        "Enter all fields. all are mandatory for all principal entries!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return; // Prevent saving if validation fails
    }

    const isDateValid = rows.every((row) => row.date >= headerData.Date);
    if (!isDateValid) {
      toast.error("Date should be greater than or equal to Entry Date", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Calculate total principal amount
    const totalAmount = rows.reduce(
      (sum, row) => sum + Number.parseFloat(row.amount || 0),
      0
    );
    if (parseFloat(rows[index]?.valuation) < totalAmount) {
      toast.error(
        `Principal amount should be less than or equal to total Valuation
         ${rows[index]?.valuation}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    // Check for duplicate dates with different amounts
    const dateMap = new Map();
    for (const item of rows) {
      if (dateMap.has(item.date) && dateMap.get(item.date) !== item.amount) {
        toast.error("For a single date, only a single amount is allowed", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      dateMap.set(item.date, item.amount);
    }

    for (let i = 0; i < rows?.length - 1; i++) {
      if (rows[i]?.date > rows[i + 1]?.date) {
        toast.error("Date should be in ascending order", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    // Proceed with saving only if validation passes
    let arr = detail?.map((i) => ({ ...i }));
    let obj = arr[trackchange?.index];
    obj.principalDetails = rows;
    obj.TotPrnAmount = totalprn.toFixed(2);
    arr[index] = obj;
    setDetails(arr);
    setPrnView(false);
  };

  const PrnViewOpen = (index) => {
    setPrnView(true);
    setTrackChange((prev) => ({
      ...prev,
      index: index,
    }));
  };
  const PrnViewClose = () => {
    setPrnView(false);
  };
  const handleDetailChange = (index, e) => {
    let arr = detail?.map((i) => ({ ...i }));
    let ShallowCopyObj = { ...arr[index] };
    let key = e?.target?.name;
    let value = e?.target?.value;
    ShallowCopyObj[key] = value;
    arr[index] = ShallowCopyObj;
    setDetails(arr);
    // Track the change to trigger calculations
    setTrackChange({
      index,
      name: key,
      value,
    });
  };

  const deleteDetailRow = (index) => {
    // Remove the row at the specified index
    const updatedRows = detail.filter((_, i) => i !== index);

    // Resequence the SRL numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.srl = (i + 1).toString();
    });
    let LotsInDetial = new Set(updatedRows.map((item) => item?.LotNo));

    let arr = Array.from(LotsInDetial);
    let newSelectedLots = arr.map((item) => ({ label: item, value: item }));
    console.log(newSelectedLots, "newSelectedLots");
    setSelectedLots(newSelectedLots);
    setDetails(updatedRows);
  };

  //--------------------------------------useEffects--------------------------------------//
  useEffect(() => {
    setTrackChange((prev) => ({
      ...prev,
      SelectedLotCount: selectedLots?.length,
    }));
    if (selectedLots && selectedLots.length >= 0) {
      // Get the current selected lot values
      const selectedLotValues = selectedLots.map((lot) => lot.value);

      // Filter out detail rows that are no longer in the selected lots
      const filteredDetails = detail.filter((item) =>
        selectedLotValues.includes(item.LotNo)
      );

      // Only update if there's a difference to avoid unnecessary re-renders
      if (filteredDetails.length !== detail.length) {
        setDetails(filteredDetails);
      }
    }
  }, [selectedLots]);

  //Valuation calculation
  useEffect(() => {
    if (trackchange.index === undefined || !trackchange.name) return;

    const { index, name, value } = trackchange;
    let updatedRows = [...detail];
    let row = updatedRows[index];
    if (!row) return; // Prevent crashing if row is undefined

    // Reset dependent fields when their dependencies change
    // eslint-disable-next-line default-case
    switch (name) {
      case "GOLD_RATE":
        row.Valuation = "";
        break;
      case "NET_WT":
        row.Valuation = "";
        break;
      case "GROSS_WT":
        row.Valuation = "";
        row.NET_WT = "";
        row.PERCENTAGE = "";
        break;
      case "PERCENTAGE":
        row.NET_WT = "";
        row.Valuation = "";
        break;
      case "Valuation":
        row.GOLD_RATE = "";
        // Don't reset PERCENTAGE when Valuation changes
        break;
      // Don't reset any fields when Description changes
      case "Description":
        break;
    }

    // Get current values (use updated values where available)
    const GROSS_WT =
      name === "GROSS_WT"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.GROSS_WT) || 0;
    const NET_WT =
      name === "NET_WT"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.NET_WT) || 0;
    const PERCENTAGE =
      name === "PERCENTAGE"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.PERCENTAGE) || 0;
    const GOLD_RATE =
      name === "GOLD_RATE"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.GOLD_RATE) || 0;

    // Skip calculations if we're just changing the Description
    if (name === "Description") return;

    let calculatedNetWeight, recalculatedPercentage, calculatedPercentage;

    // Calculate NET_WT if GROSS_WT and PERCENTAGE are provided
    if (GROSS_WT > 0 && PERCENTAGE > 0 && name !== "NET_WT" && GOLD_RATE != 0) {
      calculatedNetWeight = GROSS_WT * (PERCENTAGE / 100);
      row.NET_WT = calculatedNetWeight.toFixed(2);

      // Recalculate PERCENTAGE based on the new NET_WT (to ensure consistency)
      recalculatedPercentage = (calculatedNetWeight / GROSS_WT) * 100;
      row.PERCENTAGE = Number.parseFloat(recalculatedPercentage.toFixed(2));
      row.Valuation = ((calculatedNetWeight || NET_WT) * GOLD_RATE).toFixed(2);
    }

    // Calculate PERCENTAGE if GROSS_WT and NET_WT are provided
    if (
      GROSS_WT > 0 &&
      NET_WT > 0 &&
      name !== "PERCENTAGE" &&
      (name === "GROSS_WT" || name === "NET_WT")
    ) {
      calculatedPercentage = (NET_WT / GROSS_WT) * 100;
      row.PERCENTAGE = Number.parseFloat(calculatedPercentage.toFixed(2));
    }

    // Calculate Valuation if NET_WT and GOLD_RATE are provided
    if (NET_WT > 0 && GOLD_RATE > 0) {
      const Val = NET_WT * GOLD_RATE;
      row.Valuation = Val.toFixed(2);
    }
    setDetails(updatedRows);
  }, [trackchange]);
  //fetch item
  useEffect(() => {
    if (selectedLots?.length > trackchange?.SelectedLotCount) {
      fetchLotWiseItemFrMahajon({ LotNo: LotNo });
    }
  }, [selectedLots]);

  //load hooks with api response
  useEffect(() => {
    if (isSuccesLotWiseItemFrMahajon == true) {
      let arr = LotWiseItemFrMahajon?.map((item) => ({ ...item }));
      setDetails((prev) => [...prev, ...arr]);
    }
    CLearLotWiseItemFrMahajon();
  }, [isSuccesLotWiseItemFrMahajon]);

  //send parent the result of item detail
  useEffect(() => {
    SetItemDetails(detail);
  }, [detail]);
  //maxvaluation
  useEffect(() => {
    const maxValuation = detail[trackchange?.index]?.Valuation;
    setMaxValuation(maxValuation);
  }, [Principle]);

  useEffect(() => {
    if (successreturn == true) {
      setDetails([]);
      setPrinciple([]);
    }
  }, [successreturn]);
  
  useEffect(() => {
    fetchAdminSetUp({ Filter: "Default Wadha", CompanyID: CompanyID });
  }, []);
  //--------------------------------------variable--------------------------------------//
  return (
    <div
      className="table-box"
      style={{ height: "50vh", border: "1px solid lightgrey" }}
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
                width: "50px",
              }}
            >
              <i className="bi bi-person-circle"></i>
            </th>
            <th>LotNo*</th>
            <th>SRL*</th>
            <th>EntryDate*</th>
            <th>Description</th>
            <th>Gross Wt*</th>
            <th>Percentage</th>
            <th>Net Wt*</th>
            <th>Rate</th>
            <th>Valuation*</th>
            <th>Principal Amt*</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="tab-body">
          {detail.map((row, index) => (
            <tr key={index}>
              <td>
                <i className="bi bi-caret-right-fill"></i>
              </td>
              <td style={{ width: "100px" }}>{row?.LotNo}</td>
              <td style={{ width: "50px" }}>{row?.SRL}</td>
              <td style={{ width: "100px" }}>{row?.EntryDate}</td>
              <td style={{ width: "250px" }}>
                <div
                  style={{
                    width: "260px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row?.Description}
                </div>
              </td>
              <td style={{ width: "70px" }}>{row?.GROSS_WT}</td>

              <td>{row?.PERCENTAGE}%</td>
              <td style={{ width: "70px" }}>{row?.NET_WT}</td>
              <td>
                <input
                  placeholder="Rate"
                  className="input-cell"
                  name="GOLD_RATE"
                  value={row?.GOLD_RATE || ""}
                  onChange={(e) => handleDetailChange(index, e)}
                  type="number"
                  step="0.01"
                  style={{ width: "100%" }}
                />
              </td>
              <td>
                <input
                  placeholder="Valuation"
                  className="input-cell"
                  name="Valuation"
                  value={row.Valuation}
                  onChange={(e) => handleDetailChange(index, e)}
                  type="number"
                  style={{ width: "100%" }}
                  required
                />
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <input
                    placeholder="Principal Amount"
                    className="input-cell"
                    name="principalAmount"
                    value={detail[index]?.TotPrnAmount}
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
                    disabled={
                      !headerData?.LotNo ||
                      !headerData?.Date ||
                      !headerData?.MahajonID
                    }
                    size="sm"
                    className="ms-1"
                    onClick={() => PrnViewOpen(index)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <ReusableModal
                    Title={"Add Principal"}
                    body={
                      <PrnTakenfrmMahajon
                        handleSave={(row, totalprn, index) =>
                          handlePrnSave(row, totalprn, index)
                        }
                        maxValuation={maxValuation}
                        toaster={toast}
                        PrincipleRow={
                          detail[trackchange?.index]?.principalDetails || [
                            { id: 1, rowid: 1, srl_Prn: 1, ...prn_row },
                          ]
                        }
                        prn_row={prn_row}
                      />
                    }
                    isFullScreen={true}
                    handleClose={PrnViewClose}
                    show={PrnView}
                  />
                </div>
              </td>

              <td>
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
  );
}

export default EntryDetailMahajon
