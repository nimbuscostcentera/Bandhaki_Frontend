import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function ReusableDataGrid({
  col,
  row,
  uniquekey,
  id,
  onChangeRow,
  checkSelect,
  loading,
  DataGridHeight,
  width,
}) {
  //console.log(row);

  return (
    <DataGrid
      loading={loading}
      columns={col}
      rows={row || []}
      {...row}
      selectRow
      checkboxSelection
      getRowId={(row) => {
        if (!row) {
          return -1;
        } else {
          return row[uniquekey];
        }
      }}
      pagination={true}
      rowSelectionModel={id}
      disableMultipleRowSelection
      getRowHeight={() => "auto"}
      onRowSelectionModelChange={(uid) => {
        //console.log(uid);
        let len = uid?.length;
        onChangeRow(uid[len - 1]);
      }}
      style={{
        height: DataGridHeight || "380px",
        width: width || "97%",
        margin: "1px 20px",
      }}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  );
}

export default ReusableDataGrid;
