import React,{useState,useRef,useEffect} from 'react';
import EstimateTable from '../../Component/EstimateTable';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AddPrinciple({
  handleSave,
  prn_row = {},
  PrincipleRow = [],
  maxValuation,
  toaster,
}) {
  console.log(maxValuation, "maxValuation");
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
  const [rows, setRows] = useState([
    { rowid: 1, srl_Prn: 1, id: 1, ...prn_row },
  ]);
  useEffect(() => {
    setRows(PrincipleRow);
  }, [PrincipleRow]);
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
    const updatedRows = rows.filter((row) => row.rowid !== id);

    // Resequence the srl_Prn numbers for all remaining rows
    updatedRows.forEach((row, i) => {
      row.rowid = (i + 1).toString();
      row.srl_Prn = (i + 1).toString();
      row.id = (i + 1).toString();
    });

    setRows(updatedRows);
  };
  const AddRowPrn = () => {
    const updatedRows = rows?.map((i) => ({ ...i })) || { ...prn_row };
    updatedRows?.push({
      ...prn_row,
      rowid: rows?.length + 1,
      srl_Prn: rows?.length + 1,
      id: rows?.length + 1,
    });
    setRows(updatedRows);
  };

  return (
    <div>
      <EstimateTable
        columns={detailColumns}
        rows={
          rows || [{ rowid: 1, srl_Prn: 1, id: rows?.length + 1, ...prn_row }]
        }
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
          className="btn btn-primary mt-1 py-0 px-2 mx-2"
          onClick={AddRowPrn}
        >
          +
        </button>
        <button
          className="btn btn-success mt-1 py-0 px-2 mx-2"
          onClick={() => {
            let totalprn = 0;
            rows?.forEach((i) => {
              totalprn += Number(i?.amount);
            });
            console.log(totalprn, "prn");
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
    </div>
  );
}

export default AddPrinciple
