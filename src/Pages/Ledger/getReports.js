import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getReports(
  data,
  Col,
  data1,
  Col1,
  data2,
  Col2,
  Cust_Type,
  searchFor,
  Total,
  NetBal
) {
  // Initialize jsPDF
  const doc = new jsPDF({
    format: "a4",
    orientation: "landscape",
  });

  const Ct =
    Cust_Type == 1 ? "Customer" : Cust_Type == 2 ? "WholeSeller" : "Mahajan";

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Add title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ledger of ${searchFor}`, pageWidth / 2, 12, {
    align: "center",
  });

  // Table columns
  const tableCol = Col?.map((item) => ({
    header: item?.headername,
    key: item?.fieldname,
  }));

  const tableCol1 = Col1?.map((item) => ({
    header: item?.headername,
    key: item?.fieldname,
  }));

  const tableCol2 = Col2?.map((item) => ({
    header: item?.headername,
    key: item?.fieldname,
  }));

  let startY = 15; // Initial Y position after title
  let currentPage = 1;

  // ledger
  if (data?.length > 0) {
    startY += 5;
    const remainingSpace = pageHeight - startY - 20;
    const transaction = data;
    const transChunk = [];
    let chunkStart = 0;

    while (chunkStart < transaction.length) {
      // Estimate rows that can fit (approx 7mm per row)
      const maxRows = Math.floor(remainingSpace / 7);
      const chunkEnd = Math.min(chunkStart + maxRows, transaction.length);
      transChunk.push(transaction.slice(chunkStart, chunkEnd));
      chunkStart = chunkEnd;
    }

    transChunk?.forEach((chunk, index) => {
      const rows = chunk.reduce((acc, curr) => {
        const a = tableCol.map((col) => {
          if (curr[col.key] == 0 || curr[col.key] == "" || !curr[col.key]) {
            return "-";
          }
          return curr[col.key];
        });
        acc.push(a);
        return acc;
      }, []);

      if (startY > pageHeight - 20) {
        // Leave space for footer
        doc.addPage();
        currentPage++;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(
          margin,
          margin,
          pageWidth - margin * 2,
          pageHeight - margin * 2
        );
        startY = 20;
      }

      const startingIndex = startY;

      autoTable(doc, {
        startY: startingIndex,
        tableWidth: pageWidth - margin * 2 - 4,
        head: [tableCol.map((col) => col.header)],
        body: rows,
        theme: "grid",
        headStyles: {
          fillColor: [165, 165, 165],
          textColor: [0, 0, 0],
          halign: "center",
        },
        margin: { left: margin + 2, right: margin + 2 },
        styles: {
          fontSize: 10,
          halign: "center",
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 25, halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
          7: { cellWidth: 35, halign: "center" },
          8: { cellWidth: 35, halign: "left" },
        },
      });
    });

    if (transaction?.length > 0) {
      startY = doc?.lastAutoTable?.finalY + 5;
    }

    // due principal and due interest

    doc.text(`Due Principal: ${Total?.DuePrn}`, margin + 10, startY);
    doc.text(`Due Interest: ${Total?.DueInt}`, margin + 90, startY);
    doc.text(
      `Total: ${Total?.PrnDr} : ${Total?.PrnCr} : ${Total?.IntDr} : ${Total?.IntCr}`,
      margin + 190,
      startY
    );
    
    startY += 5;
    const rows = data.reduce((acc, curr) => {
      const a = tableCol1.map((col) => {
        if (curr[col.key] == 0 || curr[col.key] == "" || !curr[col.key]) {
          return "-";
        }
        return curr[col.key];
      });
      acc.push(a);
      return acc;
    }, []);

    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(margin + 2, startY, pageWidth - margin - 2, startY);
    startY += 5;
  }

  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.line(margin + 2, startY, pageWidth - margin - 2, startY);

  // Advance table print
  if (data1?.length > 0) {
    startY += 5;
    doc.setFontSize(12).setFont(undefined, "bold");
    doc.text("Advance Adjustment", margin + 2, startY);
    // Add space before table
    startY += 5;

    const remainingSpace = pageHeight - startY - 20;
    const transaction1 = data1;
    const transChunk1 = [];
    let chunkStart = 0;

    while (chunkStart < transaction1.length) {
      // Estimate rows that can fit (approx 7mm per row)
      const maxRows = Math.floor(remainingSpace / 7);
      const chunkEnd = Math.min(chunkStart + maxRows, transaction1.length);
      transChunk1.push(transaction1.slice(chunkStart, chunkEnd));
      chunkStart = chunkEnd;
    }

    transChunk1?.forEach((chunk, index2) => {
      if (startY > pageHeight) {
        // Leave space for footer
        doc.addPage();
        currentPage++;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(
          margin,
          margin,
          pageWidth - margin * 2,
          pageHeight - margin * 2
        );
        startY = 20;
      }

      const rows1 = chunk.reduce((acc, curr) => {
        const a = tableCol1.map((col) => {
          if (curr[col.key] == 0 || curr[col.key] == "" || !curr[col.key]) {
            return "-";
          }
          return curr[col.key];
        });
        acc.push(a);
        return acc;
      }, []);

      const startingIndex = startY;

      autoTable(doc, {
        startY: startingIndex,
        tableWidth: pageWidth - margin * 2 - 4,
        head: [tableCol1.map((col) => col.header)],
        body: rows1,
        theme: "grid",
        headStyles: {
          fillColor: [165, 165, 165],
          textColor: [0, 0, 0],
          halign: "center",
        },
        margin: { left: margin + 2, right: margin + 2 },
        styles: {
          fontSize: 10,
          halign: "left",
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 25, halign: "center" },
          1: { cellWidth: "auto", halign: "left" },
        },
      });
    });

    if (transaction1?.length > 0) {
      startY = doc?.lastAutoTable?.finalY + 5;
    }

    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(margin + 2, startY, pageWidth - margin - 2, startY);
    startY += 5;
  }

  // outstanding table
  if (data2?.length > 0) {
    doc.setFontSize(12).setFont(undefined, "bold");
   
    // Add space before table
    startY += 5;

    let remainingSpace2 = pageHeight - startY - 20;
    // Fix: Ensure transaction2 is properly initialized as an array
    let transaction2 = Array.isArray(data2) ? data2 : [];
    let transChunk2 = [];
    let chunkStart2 = 0;

    // Fix: Add proper validation before the while loop
    if (transaction2?.length > 0) {
      // console.log(transaction2, "transaction2");
      while (chunkStart2 < transaction2.length) {
        
        if (chunkStart2 < 0) {
          doc.addPage();
          currentPage++;
          doc.setDrawColor(0);
          doc.setLineWidth(0.3);
          doc.rect(
            margin,
            margin,
            pageWidth - margin * 2,
            pageHeight - margin * 2
          );
          startY = 20;
          chunkStart2 = 0;
          remainingSpace2 = pageHeight - startY - 20;
          doc.text("OutStanding Adjustment", margin + 2, startY );
        }
 startY += 5;
        console.log(remainingSpace2,currentPage, "remainingSpace2");
        // Estimate rows that can fit (approx 7mm per row)
        let maxRows = Math.floor(remainingSpace2 / 7);
        // console.log(transaction2?.length,, "transaction2");
        let chunkEnd = Math.min(chunkStart2 + maxRows, transaction2?.length);
        transChunk2.push(transaction2.slice(chunkStart2, chunkEnd));
        chunkStart2 = chunkEnd;
       
        // Estimate rows that can fit (approx 7mm per row)
        // const maxRows = Math.floor(remainingSpace / 7);
        // const chunkEnd = Math.min(chunkStart + maxRows, transaction1.length);
        // transChunk1.push(transaction1.slice(chunkStart, chunkEnd));
        // chunkStart = chunkEnd;
      }

      transChunk2?.forEach((chunk, index2) => {
        if (startY > pageHeight) {
          // Leave space for footer
          doc.addPage();
          currentPage++;
          doc.setDrawColor(0);
          doc.setLineWidth(0.3);
          doc.rect(
            margin,
            margin,
            pageWidth - margin * 2,
            pageHeight - margin * 2
          );
          startY = 20;
        }

        const rows2 = chunk.reduce((acc, curr) => {
          const a = tableCol2.map((col) => {
            if (curr[col.key] == 0 || curr[col.key] == "" || !curr[col.key]) {
              return "-";
            }
            return curr[col.key];
          });
          acc.push(a);
          return acc;
        }, []);

        const startingIndex = startY;

        autoTable(doc, {
          startY: startingIndex,
          tableWidth: pageWidth - margin * 2 - 4,
          head: [tableCol2.map((col) => col.header)],
          body: rows2,
          theme: "grid",
          headStyles: {
            fillColor: [165, 165, 165],
            textColor: [0, 0, 0],
            halign: "center",
          },
          margin: { left: margin + 2, right: margin + 2 },
          styles: {
            fontSize: 10,
            halign: "left",
            cellPadding: 2,
          },
          columnStyles: {
            0: { cellWidth: 25, halign: "center" },
            1: { cellWidth: "auto", halign: "left" },
          },
        });
      });
    }
  }

  startY = doc?.lastAutoTable?.finalY + 5;
  doc.text(
    `Net Balance: ${NetBal?.amount} ${NetBal?.type}`,
    margin + 2,
    startY,
    {
      align: "left",
    }
  );

  // Add footer to all pages
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

  // Open PDF in new window
  window.open(doc.output("bloburl"), "_blank");
}

export default getReports;
