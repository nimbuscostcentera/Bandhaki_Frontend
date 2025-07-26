import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// function getReports(data, data1, data2, Cust_Type, searchFor) {
//   const doc = new jsPDF({
//     format: "a4",
//     orientation: "landscape",
//   });

//   let Ct =
//     Cust_Type == 1 ? "Customer" : Cust_Type == 2 ? "WholeSeller" : "Mahajan";

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   let startY = 20;
//   let currentPage = 1;

//   // Add border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.3);
//   doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

//   // Title
//   doc.setFontSize(14);
//   doc.text(`Transaction History of ${searchFor}`, pageWidth / 2,16, {
//     align: "center",
//   });

//   // Function to draw side-by-side tables
//   const drawTwoTables = (leftX, rightX, topY, prnTable, adjustmentTable) => {
//     const halfWidth = (pageWidth - margin * 2 - 4) / 2;
//     autoTable(doc, {
//       startY: topY,
//       margin: { left: leftX },
//       tableWidth: halfWidth,
//       head: [["Date","LotNo","SRL", "Description"]],
//       body: prnTable.length ? prnTable : [["-", "No data"]],
//       theme: "grid",
//       styles: { fontSize: 9, cellPadding: 2 },
//       headStyles: {
//         fillColor: [220, 220, 220],
//         textColor: [0, 0, 0],
//         halign: "center",
//       },
//       columnStyles: {
//         0: { cellWidth: 30, halign: "center" },
//         1: { cellWidth: "auto", halign: "left" },
//       },
//     });

//     autoTable(doc, {
//       startY: topY,
//       margin: { left: rightX },
//       tableWidth: halfWidth,
//       head: [["Date", "Adjustment"]],
//       body: adjustmentTable.length ? adjustmentTable : [["-", "No data"]],
//       theme: "grid",
//       styles: { fontSize: 9, cellPadding: 2 },
//       headStyles: {
//         fillColor: [220, 220, 220],
//         textColor: [0, 0, 0],
//         halign: "center",
//       },
//       columnStyles: {
//         0: { cellWidth: 30, halign: "center" },
//         1: { cellWidth: "auto", halign: "left" },
//       },
//     });

//     return (
//       Math.max(
//         doc.lastAutoTable.finalY || topY,
//         doc.lastAutoTable.finalY || topY
//       ) + 5
//     );
//   };

//   // === Loop for each lot item ===
//   data.forEach((lotItem, index) => {
//     if (startY > pageHeight - 40) {
//       doc.addPage();
//       currentPage++;
//       doc.setDrawColor(0);
//       doc.setLineWidth(0.3);
//       doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
//       startY = 20;
//     }

//     // Lot Title
//     // doc.setFontSize(12).setFont(undefined, "bold");
//     // doc.text(
//     //   `LotNo: ${lotItem.LotNo} | SRL: ${lotItem.SRL}`,
//     //   margin + 2,
//     //   startY
//     // );
//     // startY += 6;

//     // Description
//     // doc.setFontSize(10).setFont(undefined, "normal");
//     // doc.text(`Item Description:`, margin + 2, startY);
//     // let descOffset = doc.getTextWidth("Item Description:");
//     // doc.setFont(undefined, "bold");
//     // doc.text(lotItem.Description, margin + 4 + descOffset, startY, {
//     //   maxWidth: pageWidth - 2 * margin - 4 - descOffset,
//     // });
//     // startY += 8;

//     // Prepare Tables
//     const prnTable =
//       lotItem?.prnData?.map((item, index) => [
//         item.EntryDate,
//         lotItem?.LotNo,
//         lotItem?.SRL,
//         `${
//           index == 0
//             ? lotItem?.Description +
//               `Rs.${item.Amount}/- with ${item.InterestPencentage}%`
//             : `Again Principle taken of Rs.${item.Amount}/- with ${item.InterestPencentage}% Interest`
//         }`,
//       ]) || [];

//     const adjustmentTable =
//       lotItem?.data?.map((item) => [item?.EntryDate,item?.summary]) || [];

//     const leftX = margin + 2;
//     const rightX = margin + 4 + (pageWidth - margin * 2 - 4) / 2;

//     startY = drawTwoTables(leftX, rightX, startY, prnTable, adjustmentTable);

//     // Separator Line
//     doc.setDrawColor(200);
//     doc.setLineWidth(0.2);
//     doc.line(margin + 2, startY, pageWidth - margin - 2, startY);
//     startY += 5;
//   });

//   // === Advance Adjustment Table ===
//   // if (data1?.length > 0) {
//   //   doc.setFontSize(12).setFont(undefined, "bold");
//   //   doc.text("Advance Adjustment", margin + 2, startY);
//   //   startY += 5;

//   //   autoTable(doc, {
//   //     startY,
//   //     tableWidth: pageWidth - margin * 2 - 4,
//   //     head: [["Date", "Description"]],
//   //     body: data1.map((row) => [row.EntryDate, row.summary]),
//   //     theme: "grid",
//   //     margin: { left: margin + 2, right: margin + 2 },
//   //     styles: { fontSize: 10, halign: "left", cellPadding: 2 },
//   //     headStyles: {
//   //       fillColor: [165, 165, 165],
//   //       textColor: [0, 0, 0],
//   //       halign: "center",
//   //     },
//   //     columnStyles: {
//   //       0: { cellWidth: 35, halign: "center" },
//   //       1: { cellWidth: "auto", halign: "left" },
//   //     },
//   //   });
//   //   startY = doc?.lastAutoTable?.finalY + 5;
//   // }

//   // === Outstanding Adjustment Table ===
//   // if (data2?.length > 0) {
//   //   doc.setFontSize(12).setFont(undefined, "bold");
//   //   doc.text("Outstanding Adjustment", margin + 2, startY);
//   //   startY += 5;

//   //   autoTable(doc, {
//   //     startY,
//   //     tableWidth: pageWidth - margin * 2 - 4,
//   //     head: [["Date", "Description"]],
//   //     body: data2.map((row) => [row.EntryDate, row.summary]),
//   //     theme: "grid",
//   //     margin: { left: margin + 2, right: margin + 2 },
//   //     styles: { fontSize: 10, halign: "left", cellPadding: 2 },
//   //     headStyles: {
//   //       fillColor: [165, 165, 165],
//   //       textColor: [0, 0, 0],
//   //       halign: "center",
//   //     },
//   //     columnStyles: {
//   //       0: { cellWidth: 35, halign: "center" },
//   //       1: { cellWidth: "auto", halign: "left" },
//   //     },
//   //   });
//   //   startY = doc?.lastAutoTable?.finalY + 5;
//   // }

//   // === Footer on each page ===
//   const pageCount = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i);
//     doc.setFontSize(8);
//     doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 5);
//     doc.text(
//       `Generated: ${moment().format("DD/MM/YYYY HH:mm")}`,
//       5,
//       pageHeight - 5
//     );
//   }

//   // === Open PDF ===
//   window.open(doc.output("bloburl"), "_blank");
// }


function getReports(data, data1, data2, Cust_Type, searchFor,CostCenter) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  let Ct =
    Cust_Type === 1 ? "Customer" : Cust_Type === 2 ? "WholeSeller" : "Mahajan";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Draw border
  doc.setDrawColor(0);
  doc.setLineWidth(0.05);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Title
  doc.setFontSize(14);
  doc.text(
    `${CostCenter ? `CostCenter :${CostCenter} wise ` :""} Transaction History  ${searchFor ? "of " + searchFor : ""}`,
    pageWidth / 2,
    16,
    {
      align: "center",
    }
  );

  // === Table Data Preparation ===
  const tableBody = [];
  data.forEach((lotItem,index) => {
    const prnData = lotItem?.prnData || [];
    const adjData = lotItem?.data || [];
      const OpDate = lotItem?.EntryDate || "";
    const maxLength = Math.max(prnData.length, adjData.length);

    for (let i = 0; i < maxLength; i++) {
      const prn = prnData[i] || {};
      const adj = adjData[i] || {};
    
      const adjDate = adj?.EntryDate || "";

      const lotNo = lotItem?.LotNo || "";
      const srl = lotItem?.SRL || adj?.SRL || "";

      const description = prn.Amount && prn.EntryDate && prn.InterestPencentage ?
        i == 0 
          ? `${lotItem.Description}. (Rs.${prn.Amount}/- taken on ${prn.EntryDate} with ${prn.InterestPencentage}% interest)`
          : `Again Prn. Rs.${prn.Amount}/- taken on ${prn.EntryDate} with ${prn.InterestPencentage}% interest` :"-";

      const adjustment = adj?.summary || "";

      tableBody.push([OpDate, lotNo, srl, description, adjDate, adjustment]);
    }
  });

  // === Table Header ===
  const headers = [
    ["Op.Date", "Lot No", "SRL", "Description", "Adj. Date", "Adjust Dafa"],
  ];

  // === Add Table ===
  autoTable(doc, {
    startY: 22,
    theme: 'grid',
    head: headers,
    body: tableBody,
    margin: { left: 10, right: 10 },
    styles: {
      fontSize:10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: 0,
      halign: "center",
    },
    bodyStyles: {
      valign: "top",
    },
    columnStyles: {
      3: { cellWidth: 95 ,halign:"center"},
    },
    didDrawPage: function (data) {
      // Draw border
      doc.setDrawColor(0);
      doc.setLineWidth(0.05);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
    },
  });

  // === Open PDF in new tab ===
  window.open(doc.output("bloburl"), "_blank");
}


export default getReports;
