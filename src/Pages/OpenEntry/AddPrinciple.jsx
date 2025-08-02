import React, { useState, useRef, useEffect } from "react";
import EstimateTable from "../../Component/EstimateTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AddPrinciple({
  handleSave,
  prn_row,
  PrincipleRow,
  maxValuation = 0,
  toaster,
  Prn_Column,
  srl_Prn = 1,
  maxlen = 0,
  entityType,
}) {
  // console.log(prn_row, PrincipleRow,"check");
  // Modal columns configuration - Updated to match EstimateTable's expected format
  let detailColumns = Array.isArray(Prn_Column)
    ? Prn_Column
    : [
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
          width: "130px",
          banglaDate: true,
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
            { label: "Bank Transfer", value: 2 },
            { label: "UPI", value: 3 },
            { label: "Adjust", value: 4 },
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
  const [rows, setRows] = useState([
    { id: 1, rowid: 1, [srl_Prn]: maxlen + 1, ...prn_row },
  ]);

  const srlPrnInputRef = useRef(null);
  const handleDetailModalChange = (rowIndex, colKey, e) => {
    // Find the column definition
    const column = detailColumns.find((col) => col.key === colKey);

    // If the column is marked as readOnly, don't update it
    if (column && column.readOnly) {
      return;
    }
    const regex = {
      amount: /^(\d*\.?\d{0,2})?$/,
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
  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.rowid != id);

    // Resequence the srl_Prn numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.id = (i + 1).toString();
      row.rowid = (i + 1).toString();
      row[srl_Prn] = (i + 1 + maxlen).toString();
    });
    setRows(updatedRows);
  };
  const AddRowPrn = () => {
    let updatedRows = rows?.map((i) => ({ ...i })) || [];
    updatedRows?.push({
      ...prn_row,
      id: rows?.length + 1,
      rowid: rows?.length + 1,
      [srl_Prn]: maxlen + rows?.length + 1,
    });
    setRows(updatedRows);
  };

  useEffect(() => {
    if (entityType !== 1 && prn_row[0]?.actualWadah)
    {
      PrincipleRow?.forEach((item, index) => {
        item.id = index + 1;
        item.rowid = index + 1;
        item[srl_Prn] = maxlen + 1;
      });
      setRows(PrincipleRow);
    }
  }, [prn_row,PrincipleRow]);

  console.log(rows[0]);

  return (
    <div>
      {Array?.isArray(rows) && rows?.length > 0 && (
        <>
          <EstimateTable
            columns={detailColumns}
            rows={rows}
            handleChange={handleDetailModalChange}
            deleteRow={deleteRow}
            isDelete={true}
            id={"rowid"}
            toaster={toast}
            tableWidth={"100%"}
            priorityref={srlPrnInputRef}
          />
          <div className="d-flex justify-content-end mt-1">
            <button
              className="btn btn-primary mt-1 py-1 px-2 mx-2"
              onClick={AddRowPrn}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
            <button
              className="btn btn-success mt-1 py-1 px-2 mx-2"
              onClick={() => {
                let totalprn = 0;
                rows?.forEach((i) => {
                  totalprn += Number(i?.amount);
                });
                if (totalprn > maxValuation) {
                  toaster.error(
                    "Total Valuation should be less than " + maxValuation
                  );
                } else {
                  handleSave(rows);
                }
              }}
            >
              <i className="bi bi-floppy"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddPrinciple;
