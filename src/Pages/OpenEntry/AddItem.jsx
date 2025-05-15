import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import ReusableModal from "../../Component/ReusableModal";
import AddPrinciple from "./AddPrinciple";
import useAddExtraItem from "../../store/AddStore/useAddExtraItem";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function AddItem({
  newrow,
  params,
  setParams,
  lastSrl,
  lotno,
  trancode,
  entityType,
  headerData,
  headerid,

}) {
  //-----------------------------------usestate & useref------------------------------------------//
  const prn_row = {
    interestPercentage: null,
    srl_Prn: 1,
    date: null,
    amount: null,
    paymentMode: 1,
    reminderWadah: null,
    actualWadah: null,
  };

  const srlInputRef = useRef(null);
  const srlPrnInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const [detailRows, setDetailRows] = useState([]);
  const [trackchange, setTrackChange] = useState({
    index: 0,
    value: 0,
    name: 0,
  });
  //------------------------------------API call------------------------------------------------------//
  const {
    ClearStateExtraItemAdd,
    ExtraItemAddError,
    isExtraItemAddLoading,
    ExtraItemAddSuccess,
    ExtraItemAdd,
  } = useAddExtraItem();
  const {CompanyID}=useFetchAuth()
  //-------------------------------------functions-----------------------------------//
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...detailRows];

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
  //row delete
  const deleteDetailRow = (index) => {
    setParams((prev) => ({ ...prev, isDelete: true }));
    let arr = [...detailRows];
    const updatedRows = arr?.filter((i) => {
      return i?.srl != (index + 1 + lastSrl);
    });
    console.log(index);
    // Resequence the SRL numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.srl = (lastSrl + i + 1).toString(); 
    });
    setParams((prev) => {
      let countrow = 0;
      if (prev?.ItemCounter - 1 >= 0)
        countrow=params?.ItemCounter-1;
      console.log(countrow);
      return { ...prev, ItemCounter: countrow,isDelete:true };
    });
    setDetailRows(updatedRows);
  };
  function onfocusinput() {
    if (srlPrnInputRef.current) {
      srlPrnInputRef.current.focus(); // ✅ Focus on the date field when page loads
    }
  }
  const handleOpenModal = (index) => {
    setShowModal(true);
    setTrackChange((prev) => ({ ...prev, index: index }));
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleSave = (data) => {
    let arr = detailRows?.map((item) => ({ ...item }));
    arr[trackchange.index].PrnData = data;
    let totamt = 0;
    data?.forEach((item) => {
      totamt = parseFloat(totamt) + parseFloat(item?.amount);
    });
    arr[trackchange.index].principalAmount = totamt;
    setDetailRows(arr);
    setShowModal(false);
  };
  const handleSubmit = () => {
    let finalobj = {
      ...headerData,
      Cust_Type: entityType,
      TranCode: trancode,
      HeaderID: headerid,
      details: [...detailRows],
      CompanyID,
    };
    console.log(finalobj);
    ExtraItemAdd(finalobj);
  };
  //-----------------------------------useEffect-----------------------------------------------------//
  //valueation adjust of item
  useEffect(() => {
    if (trackchange.index === undefined || !trackchange.name) return;

    const { index, name, value } = trackchange;
    const updatedRows = [...detailRows];
    const row = updatedRows[index];

    // Reset dependent fields when their dependencies change
    switch (name) {
      case "rate":
        row.valuation = "";
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
        row.rate = "";
        break;
      // Don't reset any fields when description changes
      default:
        break;
    }

    // Get current values (use updated values where available)
    const grossWeight =
      name === "grossWeight"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.grossWeight) || 0;
    const netWeight =
      name === "netWeight"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.netWeight) || 0;
    const percentage =
      name === "percentage"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.percentage) || 0;
    const rate =
      name === "rate"
        ? Number.parseFloat(value) || 0
        : Number.parseFloat(row.rate) || 0;

    let calculatedNetWeight = netWeight;
      // recalculatedPercentage = percentage;

    // Calculate netWeight if grossWeight and percentage are provided
    if (grossWeight > 0 && percentage > 0) {
      calculatedNetWeight = grossWeight * (percentage / 100);
      row.netWeight = calculatedNetWeight.toFixed(2);
    }
    // if (calculatedNetWeight > 0 && grossWeight > 0 && rate > 0) {
    //   Recalculate percentage based on the new netWeight (to ensure consistency)
    //   recalculatedPercentage = (calculatedNetWeight / grossWeight) * 100;
    //   row.percentage = Number.parseFloat(recalculatedPercentage.toFixed(2));
    // }
    if (calculatedNetWeight > 0 && rate > 0) {
      row.valuation = (calculatedNetWeight * rate).toFixed(2);
    }
    if (grossWeight < netWeight) {
      row.percentage = "";
      row.netWeight = "";
      row.valuation = "";
    }

    setDetailRows(updatedRows);
  }, [trackchange]);
  //add row of table
  useEffect(() => {
    if (params?.ItemCounter && params?.ItemCounter > -1 && !params?.isDelete) {
      if (params?.ItemCounter > 0) {
        setDetailRows((prev) => [
          ...prev,
          {
            srl: params?.ItemCounter + lastSrl,
            ...newrow,
            PrnData: [{...prn_row}],
          },
        ]);
      }
    }
    if (params?.ItemCounter == 0) {
      console.log("hi");
      setDetailRows([]);
    }
  }, [params?.ItemCounter]);
  //toaster
  useEffect(() => {
    if (ExtraItemAddError) {
      toast.error(ExtraItemAddError,{position:"top-right",autoClose:3000});
    }
    if (ExtraItemAddSuccess) {
      toast.success(ExtraItemAddSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateExtraItemAdd();
  },[ExtraItemAddError,ExtraItemAddSuccess]);
console.log(params?.ItemCounter)
  return (
    <div>
      <div>
        <hr />
        <h6 className="text-center">Add Item</h6>
        <hr />
      </div>
      <div
        className="table-box"
        style={{ maxHeight: "50vh", border: "1px solid lightgrey" }}
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
                <td style={{ width: "50px" }}>{row?.srl}</td>
                <td>
                  <input
                    ref={srlInputRef}
                    placeholder="Description"
                    className="input-cell form-input"
                    name="description"
                    value={row?.description || ""}
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
                    value={row?.grossWeight || ""}
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
                    value={row?.percentage || ""}
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
                    value={row?.netWeight || ""}
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
                    value={row?.rate || ""}
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
                    value={row?.valuation || ""}
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
                      value={row?.principalAmount || ""}
                      type="number"
                      step="0.01"
                      style={{ width: "100%" }}
                      readOnly
                    />

                    <Button
                      variant={
                        row?.principalDetails?.length > 0
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
        <ReusableModal
          isFullScreen={true}
          show={showModal}
          handleClose={handleClose}
          Title={"Add Principle"}
          body={
            <AddPrinciple
              toaster={toast}
              handleSave={handleSave}
              prn_row={prn_row}
              PrincipleRow={detailRows[trackchange?.index]?.PrnData}
              maxValuation={detailRows[trackchange?.index]?.valuation}
            />
          }
        />
      </div>
      <div className="d-flex justify-content-end mt-1">
        <button className="btn btn-success py-1 px-2" onClick={handleSubmit}>
          <i className="bi bi-floppy"></i>
        </button>
      </div>
    </div>
  );
}

export default AddItem;
