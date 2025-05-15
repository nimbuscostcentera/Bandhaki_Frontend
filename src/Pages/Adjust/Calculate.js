"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetchAdjustEntry from "../../store/ShowStore/useFetchAdjustEntry";
import moment from "moment";
const Calculate = ({
  checkedIds,
  voucherDate,
  fineInterestCode,
  onSave,
  onClose,
  entityType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [masterToggle, setMasterToggle] = useState(true);
  // Nested data structure with arrays inside an array
  const { isAdjustEntryLoading, AdjustEntryList, fetchAdjustEntry } =
    useFetchAdjustEntry();

  useEffect(() => {
    fetchAdjustEntry({
      data: checkedIds,
      FineId: fineInterestCode,
      VoucherDate: moment().format("YYYY-MM-DD"),
      Cust_Type: entityType,
    });
  }, [checkedIds, fineInterestCode]);

  useEffect(() => {
    setCalculationData(AdjustEntryList);
  }, [AdjustEntryList]);

  const [calculationData, setCalculationData] = useState([]);

  const handleSave = () => {};
  // Function to handle toggle checkbox changes
  const handleToggleChange = (groupIndex, rowIndex) => {
    const updatedData = [...calculationData];
    updatedData[groupIndex] = [...updatedData[groupIndex]];

    // Don't modify the total row
    if (updatedData[groupIndex][rowIndex].interfaceName === "Total") {
      return;
    }

    updatedData[groupIndex][rowIndex] = {
      ...updatedData[groupIndex][rowIndex],
      isToggled: !updatedData[groupIndex][rowIndex].isToggled,
    };

    // If toggled on, set interestCr equal to interestDr
    if (
      updatedData[groupIndex][rowIndex].isToggled &&
      updatedData[groupIndex][rowIndex].interestDr
    ) {
      // Ensure we're using the exact same value format
      updatedData[groupIndex][rowIndex].interestCr = Number.parseFloat(
        updatedData[groupIndex][rowIndex].interestDr
      ).toFixed(2);
    } else if (!updatedData[groupIndex][rowIndex].isToggled) {
      // If toggled off, clear interestCr
      updatedData[groupIndex][rowIndex].interestCr = "";
    }

    // Update the totals for this group
    updateGroupTotals(updatedData, groupIndex);

    setCalculationData(updatedData);
  };
  // Function to handle remarks changes
  const handleRemarksChange = (groupIndex, rowIndex, value) => {
    const updatedData = [...calculationData];
    updatedData[groupIndex] = [...updatedData[groupIndex]];

    // Don't modify the total row
    if (updatedData[groupIndex][rowIndex].interfaceName === "Total") {
      return;
    }

    updatedData[groupIndex][rowIndex] = {
      ...updatedData[groupIndex][rowIndex],
      remarks: value,
    };

    setCalculationData(updatedData);
  };
  // Handle principalCr input change
  const handlePrincipalCrChange = (groupIndex, rowIndex, value) => {
    const updatedData = [...calculationData];
    updatedData[groupIndex] = [...updatedData[groupIndex]];

 const amountRegex = /^(\d*\.?\d{0,2})?$/; // Allows up to 2 decimal places
    // Format the value to 2 decimal places for consistency
    let isValid = amountRegex.test(value);
    
    if (!isValid) {
      return;
    }
    const formattedValue = value === "" ? "" : parseFloat(value);

    updatedData[groupIndex][rowIndex] = {
      ...updatedData[groupIndex][rowIndex],
      principalCr: formattedValue,
    };

    // Update the totals for this group
    updateGroupTotals(updatedData, groupIndex);
    setCalculationData(updatedData);
  };
  // Function to update totals for a specific group
  const updateGroupTotals = (data, groupIndex) => {
    const group = data[groupIndex];
    const totalRowIndex = group.length - 1;

    // Calculate totals for this group (excluding the total row itself)
    const groupTotals = group.slice(0, totalRowIndex).reduce(
      (acc, row) => {
        // Use parseFloat and toFixed to handle floating point precision
        acc.principalDr = (
          Number.parseFloat(acc.principalDr) +
          Number.parseFloat(row.principalDr || 0)
        ).toFixed(2);
        acc.principalCr = (
          Number.parseFloat(acc.principalCr) +
          Number.parseFloat(row.principalCr || 0)
        ).toFixed(2);
        acc.interestDr = (
          Number.parseFloat(acc.interestDr) +
          Number.parseFloat(row.interestDr || 0)
        ).toFixed(2);
        acc.interestCr = (
          Number.parseFloat(acc.interestCr) +
          Number.parseFloat(row.interestCr || 0)
        ).toFixed(2);
        return acc;
      },
      {
        principalDr: "0.00",
        principalCr: "0.00",
        interestDr: "0.00",
        interestCr: "0.00",
      }
    );

    // Update the total row
    data[groupIndex][totalRowIndex] = {
      ...data[groupIndex][totalRowIndex],
      principalDr: groupTotals.principalDr || "0.00",
      principalCr: groupTotals.principalCr || "0.00",
      interestDr: groupTotals.interestDr || "0.00",
      interestCr: groupTotals.interestCr || "0.00",
    };
  };
  // Calculate grand totals across all groups
  const calculateGrandTotals = () => {
    return calculationData.reduce(
      (acc, group) => {
        // Find the total row in each group
        const totalRow = group.find((row) => row.interfaceName === "Total");
        if (totalRow) {
          // Use parseFloat and toFixed to handle floating point precision
          acc.principalDr = (
            Number.parseFloat(acc.principalDr) +
            Number.parseFloat(totalRow.principalDr || 0)
          ).toFixed(2);
          acc.principalCr = (
            Number.parseFloat(acc.principalCr) +
            Number.parseFloat(totalRow.principalCr || 0)
          ).toFixed(2);
          acc.interestDr = (
            Number.parseFloat(acc.interestDr) +
            Number.parseFloat(totalRow.interestDr || 0)
          ).toFixed(2);
          acc.interestCr = (
            Number.parseFloat(acc.interestCr) +
            Number.parseFloat(totalRow.interestCr || 0)
          ).toFixed(2);
        }
        return acc;
      },
      {
        principalDr: "0.00",
        principalCr: "0.00",
        interestDr: "0.00",
        interestCr: "0.00",
      }
    );
  };
  // Initialize totals for each group
  const initializeGroupTotals = () => {
    const updatedData = [...calculationData];

    updatedData.forEach((group, groupIndex) => {
      updateGroupTotals(updatedData, groupIndex);
    });

    return updatedData;
  };
  // Initialize totals when component mounts
  useEffect(() => {
    setCalculationData(initializeGroupTotals());
  }, []);

  const grandTotals = calculateGrandTotals();
  const handleMasterToggleChange = () => {
    const updatedData = [...calculationData];
    const newToggleState = !masterToggle;

    // Update all eligible rows with the new toggle state
    updatedData.forEach((group, groupIndex) => {
      group.forEach((row, rowIndex) => {
        if (
          row.interfaceName !== "Opening" &&
          row.interfaceName !== "Receive" &&
          row.interfaceName !== "Total" &&
          row.interfaceName !== "Payment" &&
          row.interestDr
        ) {
          // Update the row's toggle state
          updatedData[groupIndex][rowIndex] = {
            ...updatedData[groupIndex][rowIndex],
            isToggled: newToggleState,
          };

          // If toggled on, set interestCr equal to interestDr
          if (newToggleState) {
            updatedData[groupIndex][rowIndex].interestCr = Number.parseFloat(
              updatedData[groupIndex][rowIndex].interestDr
            ).toFixed(2);
          } else {
            // If toggled off, clear interestCr
            updatedData[groupIndex][rowIndex].interestCr = "";
          }
        }
      });

      // Update the totals for this group
      updateGroupTotals(updatedData, groupIndex);
    });

    setMasterToggle(newToggleState);
    setCalculationData(updatedData);
  };
  useEffect(() => {
    // Check if all eligible toggles are checked
    const allToggled = calculationData.every((group) =>
      group.every(
        (row) =>
          row.interfaceName === "Opening" ||
          row.interfaceName === "Total" ||
          row.interfaceName === "Receive" ||
          row.interfaceName === "Payment" ||
          !row.interestDr ||
          row.isToggled
      )
    );

    setMasterToggle(allToggled);
  }, [calculationData]);

  return (
    <Container fluid>
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <table hover className="mb-0" style={{ width: "90vw" }}>
            <thead
              className="tab-head"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2, // Ensure background isn't transparent
              }}
            >
              <tr>
                <th style={{ backgroundColor: "#f0f0f0" }}>Row No.</th>
                <th style={{ backgroundColor: "#f0f0f0", width: "90px" }}>
                  Entry Date
                </th>
                <th style={{ backgroundColor: "#f0f0f0" }}>Lot No</th>
                <th style={{ backgroundColor: "#f0f0f0", width: "50px" }}>
                  Srl
                </th>
                <th style={{ backgroundColor: "#f0f0f0" }}>Srl_Prn</th>
                <th style={{ backgroundColor: "#f0f0f0" }}>Start Date</th>
                <th style={{ backgroundColor: "#f0f0f0" }}>End Date</th>
                <th style={{ backgroundColor: "#f0f0f0" }}>Interface Name</th>
                <th style={{ backgroundColor: "#ffff00" }}>Principal Dr</th>
                <th style={{ backgroundColor: "#ffff00", width: "100px" }}>
                  Principal Cr
                </th>
                <th style={{ backgroundColor: "#00ffff" }}>Interest Dr</th>
                <th style={{ backgroundColor: "#00ffff" }}>Interest Cr</th>
                <th style={{ backgroundColor: "#f0f0f0", width: "150px" }}>
                  Remarks
                </th>
                <th style={{ backgroundColor: "#f0f0f0", width: "60px" }}>
                  <div>
                    <div>Action</div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody
              className="tab-body"
              style={{
                overflowY: "auto",
                zIndex: 1,
              }}
            >
              {calculationData.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {group.map((row, rowIndex) => (
                    <tr
                      key={`${groupIndex}-${rowIndex}`}
                      style={{
                        backgroundColor:
                          row.interfaceName === "Total"
                            ? "#f3f3f3" // Updated color for "Total"
                            : row.interfaceName === "Opening" ||
                              row.interfaceName === "Receive" ||
                              row.interfaceName === "Payment"
                            ? "#ffffa0"
                            : "#ffffff",
                        fontWeight:
                          row.interfaceName === "Total" ? "bold" : "normal",
                      }}
                    >
                      <td>{rowIndex + 1 || ""}</td>
                      <td>{row.entryDate || ""}</td>
                      <td>{row.lotNo || ""}</td>
                      <td>{row.srl || ""}</td>
                      <td>{row.srl_Prn || ""}</td>
                      <td>{row.startDate || ""}</td>
                      <td>{row.endDate || ""}</td>
                      <td>{row.interfaceName || ""}</td>
                      <td>
                        {row.principalDr == 0
                          ? "-"
                          : Number.parseFloat(row.principalDr).toFixed(2)}
                      </td>
                      <td>
                        {row.interfaceName === "Opening" ||
                        row.interfaceName === "Receive" ||
                        row.interfaceName === "Payment" ? (
                          <Form.Control
                            type="number"
                            value={row.principalCr || ""}
                            onChange={(e) =>
                              handlePrincipalCrChange(
                                groupIndex,
                                rowIndex,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          row.principalCr || "-"
                        )}
                      </td>
                      <td>
                        {row.interestDr == 0
                          ? "-"
                          : Number.parseFloat(row.interestDr).toFixed(2)}
                      </td>
                      <td>
                        {row.interestCr == 0
                          ? "-"
                          : Number.parseFloat(row.interestCr).toFixed(2)}
                      </td>
                      <td>
                        {(row.interfaceName !== "Opening" ||
                          row.interfaceName !== "Receive" ||
                          row.interfaceName !== "Payment") &&
                        row.interfaceName !== "Total" ? (
                          <Form.Control
                            type="text"
                            value={row.remarks || ""}
                            onChange={(e) =>
                              handleRemarksChange(
                                groupIndex,
                                rowIndex,
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        ) : null}
                      </td>
                      <td>
                        {(row.interfaceName !== "Opening" ||
                          row.interfaceName !== "Receive" ||
                          row.interfaceName !== "Payment") &&
                        row.interfaceName !== "Total" ? (
                          <Form.Check
                            type="checkbox"
                            checked={row.isToggled || false}
                            onChange={() =>
                              handleToggleChange(groupIndex, rowIndex)
                            }
                            disabled={!row.interestDr}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                  {/* Add a separator row between groups if not the last group */}
                  {groupIndex < calculationData.length - 1 && (
                    <tr>
                      <td
                        colSpan={14}
                        style={{ padding: "4px", backgroundColor: "#e0e0e0" }}
                      ></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {/* Grand Total Row */}
              <tr style={{ fontWeight: "bold", backgroundColor: "#d0d0d0" }}>
                <td colSpan={8} className="text-center">
                  Grand Total:
                </td>
                <td>{Number.parseFloat(grandTotals.principalDr).toFixed(2)}</td>
                <td>{Number.parseFloat(grandTotals.principalCr).toFixed(2)}</td>
                <td>{Number.parseFloat(grandTotals.interestDr).toFixed(2)}</td>
                <td>{Number.parseFloat(grandTotals.interestCr).toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs={12} sm={12} md={9} lg={10} xl={11}>
          <div className="d-flex align-items-end justify-content-end flex-wrap my-4">
            <span>Check All</span>
            <Form.Check
              type="checkbox"
              checked={masterToggle}
              onChange={handleMasterToggleChange}
              className="ms-2"
            />
          </div>
        </Col>
        <Col xs={12} sm={12} md={3} lg={2} xl={1} className="">
          <div className="d-flex justify-content-end align-items-center my-3">
            <Button
              onClick={() => onSave(calculationData)}
              disabled={
                grandTotals.interestCr == 0 && grandTotals?.principalCr == 0
              }
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Calculate;
