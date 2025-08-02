import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import moment from "moment";

const getPrintDafa = (data,Cust_Type,searchFor) => {
  // Initialize jsPDF with autoTable
  const doc = new jsPDF();
  console.log(data,"print data");
  let Ct=Cust_Type==1?"Customer":Cust_Type==2?"WholeSeller":"Mahajan";
  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const ROWS_PER_PAGE = 30;
  // Add border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Add title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Dafa List ${searchFor||data[0]?.CustomerName}`, pageWidth / 2, 20, {
    align: "center",
  });

  // Main Items Table
  let startY = 18;
  let PrintableRows = data?.map((item) => {
    let obj =
      Cust_Type != 3
        ? {
            LotNo: item?.Lot_date,
            Description: item?.Description,
            MahajanName: item?.MahajanName,
            WareHouseName: item?.WareHouseName,
            Update_Prn_Rcv: item?.Update_Prn_Rcv,
            SRL: item?.SRL,
            // WareHouseName : item?.WareHouseName,
          }
        : {
            LotNo: item?.Lot_date,
            Description: item?.Description,
            Update_Prn_Rcv: item?.Update_Prn_Rcv,
            SRL: item?.SRL,
          };
    return obj;
  });
  const tablecol =
    Cust_Type !== 3
      ? [
          { header: "LotNo.", key: "LotNo" },
          { header: "SRL", key: "SRL" },
          { header: "Item Desc.", key: "Description" },
          { header: "Mahajan", key: "MahajanName" },
          { header: "WareHouse", key: "WareHouseName" },
          { header: "Prn Amt.", key: "Update_Prn_Rcv" },
        ]
      : [
          { header: "LotNo.", key: "LotNo" },
          { header: "SRL", key: "SRL" },
          { header: "Item Desc.", key: "Description" },
          { header: "Prn Amt.", key: "Update_Prn_Rcv" },
        ];

  let rowsPerPage = ROWS_PER_PAGE;

  for (let i = 0; i < PrintableRows.length; i += rowsPerPage) {
    if (i !== 0) {
      doc.addPage();
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
      startY = 5;
    }
    rowsPerPage = i == 0 ? ROWS_PER_PAGE : 35;
    autoTable(doc, {
      startY: startY + 10,
      tableWidth: pageWidth - margin * 2 - 4,
      head: [tablecol?.map((col) => col?.header)],
      body: PrintableRows?.slice(i, rowsPerPage + 1).map((row) =>
        tablecol.map((col) => row[col?.key])
      ),
      theme: "grid",
      headStyles: {
        fillColor: [165, 165, 165],
        textColor: [0, 0, 0],
        halign: "center",
      },
      margin: { left: margin + 2, right: margin + 2 },
      styles: { fontSize: 10, halign: "center" },
      columnStyles: {
        0: { cellWidth:35},
        1: { cellWidth:15},
        2: {cellWidth:75}
      },
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 5);
    doc.text(
      `Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,
      5,
      pageHeight - 5
    );
  }

  // Save the PDF
  window.open(doc.output("bloburl"), "_blank");
  // doc.save("customer_order_invoice.pdf");
};
export default getPrintDafa;
