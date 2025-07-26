import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import ReusableModal from "../../Component/ReusableModal";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown";
import Table from "../../Component/Table";

import useFetchSearchFrAdjust from "../../store/ShowStore/useFetchSearchFrAdjust";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchSelectedSearchList from "../../store/ShowStore/useFetchSelectedSearch";
import useFetchAdjustEntry from "../../store/ShowStore/useFetchAdjustEntry";

const Calculate = ({
  checkedIds,
  voucherDate,
  fineInterestCode,
  onSave,
  onClose,
  entityType,
}) => {
  //---------------------------------------hook---------------------------------//
  const [Filter, setFilter] = useState({
    Cust_Type: entityType == 1 || entityType == 2 ? entityType : -1,
    HeaderID: -1,
    Adj_Cust_Type: entityType,
    MahajanID: checkedIds[0]?.CustomerId,
  });
  const [VoucherTypeList, setVoucherTypeList] = useState([]);
  const [FilteredSearchList, setFilteredSearchList] = useState([]);
  const [isProcceed, setIsProcceed] = useState(false);
  const [masterToggle, setMasterToggle] = useState(true);
  const [calculationData, setCalculationData] = useState([]);
  const [isViewModeOn, setIsViewModeOn] = useState(false);
  const [searchHeaderId , setSearchHeaderId] = useState(-1);
  // const [FilteredCalculationData, setFilteredCalculationData] = useState([]);
  //-------------------------------API-----------------------------------------//
  const { CompanyID, user } = useFetchAuth();
  // Nested data structure with arrays inside an array
  const { isAdjustEntryLoading, AdjustEntryList, fetchAdjustEntry } =
    useFetchAdjustEntry();
  const {
    SearchFrAdjustError,
    isSearchFrAdjustLoading,
    isSearchFrAdjustSucc,
    SearchFrAdjustList,
    fetchSearchFrAdjustMaster,
    ClearStateSearchFrAdjust,
  } = useFetchSearchFrAdjust();
  const {
    fetchSelectedSearchList,
    SelectedSearchListError,
    isSelectedSearchListLoading,
    isSelectedSearchListSucc,
    SelectedSearchList,
    ClearStateSelectedSearchList,
  } = useFetchSelectedSearchList();
  //----------------------------Function--------------------------------------------------//

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

    const amountRegex = /^(\d*\.?\d{0,2})?$/;
    if (!amountRegex.test(value)) {
      return;
    }

    const row = updatedData[groupIndex][rowIndex];
    const formattedValue = value === "" ? "" : parseFloat(value);

    // Cap principalCr at principalDr value
    let validPrincipalCr = formattedValue;
    const principalDr = Number(row.principalDr) || 0; // Ensure numeric comparison

    if (formattedValue !== "" && formattedValue > principalDr) {
      validPrincipalCr = principalDr;
    }

    updatedData[groupIndex][rowIndex] = {
      ...row,
      principalCr: validPrincipalCr,
    };

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
  //Checkbox Controler
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
          row.interfaceName !== "Mahajon" &&
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
  //FilterHandler
  const FilterHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    // Reset filtered list when HeaderID is cleared
    if (key === "HeaderID" && (value === null || value === undefined)) {
      setFilteredSearchList([]);
    }
    if (key == "Cust_Type") {
      setFilter((prev) => ({ ...prev, [key]: value, HeaderID: -1 }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };
  //Filtered Data View
  const OpenFilteredData = () => {
    setIsViewModeOn(true);
  };
  const CloseFilteredData = () => {
    setIsViewModeOn(false);
  };

  const handleFilterout = () => {
    const filteredData = calculationData.filter((group) => {
      // Check if any row in the group matches the search criteria
      const hasMatchingRow = group.some((row) => {
        return FilteredSearchList.some(
          (searchItem) =>
            searchItem.LotNo === row.lotNo && searchItem.SRL === row.srl
        );
      });
      return hasMatchingRow;
    });

    setCalculationData(filteredData);
    setSearchHeaderId(Filter?.HeaderID);
  };

  //---------------------------------------------------useEffect----------------------------------------//
  // Initialize totals when component mounts
  useEffect(() => {
    setCalculationData(initializeGroupTotals());
  }, [entityType]);
  // let newarr = isProcceed ? [...calculationData] : [...FilteredCalculationData];
  const grandTotals = calculateGrandTotals();

  useEffect(() => {
    // Check if all eligible toggles are checked
    const allToggled = calculationData.every((group) =>
      group.every(
        (row) =>
          row.interfaceName === "Opening" ||
          row.interfaceName === "Total" ||
          row.interfaceName === "Receive" ||
          row.interfaceName === "Payment" ||
          (row.interfaceName === "Mahajon" && !row.interestDr) ||
          row.isToggled
      )
    );

    setMasterToggle(allToggled);
  }, [calculationData]);

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

  //call search data for adjust
  useEffect(() => {
    // console.log("did you call me");
    if (
      Filter?.Cust_Type == -1 ||
      !Filter?.Cust_Type ||
      Filter?.Cust_Type == 0
    ) {
      return;
    }
    fetchSearchFrAdjustMaster({
      Cust_Type: Filter?.Cust_Type,
      CompanyID,
      ...user,
    });
  }, [Filter?.Cust_Type]);

  useEffect(() => {
    if (Filter?.HeaderID == -1 || Filter?.HeaderID == 0 || !Filter?.HeaderID) {
      return;
    }
    // console.log(Filter, "Filter");
    fetchSelectedSearchList({ ...Filter, ...user });
  }, [Filter?.HeaderID]);

  // useEffect(() => {
  //   if (isProcceed)
  //   {
  //     let arr = [];

  //     calculationData?.forEach((item) => {
  //       console.log(item,"item");
  //       FilteredSearchList?.forEach((subItem) => {
  //         if (item[0]?.lotNo == subItem?.LotNo && item[0]?.srl == subItem?.SRL) {
  //           arr.push(item);
  //         }
  //       })
  //     });

  //     setFilteredCalculationData(arr);
  //   }
  // },[isProcceed])
  //--------------------------------------------const-------------------------------------------------//
  const CustTypeList = [
    { Value: -1, Name: "--Select Cust type--" },
    { Value: 1, Name: "Customer" },
    { Value: 2, Name: "WholeSaler" },
  ];

  useEffect(() => {
    let list = [];

    if (isSearchFrAdjustSucc && Filter?.Cust_Type > 0) {
      console.log(
        isSearchFrAdjustSucc,
        entityType,
        Filter?.Cust_Type,
        SearchFrAdjustList,
        "find"
      );
      SearchFrAdjustList?.forEach((item) => {
        let obj = {};
        obj.value = `${item?.ID}`;
        obj.label = `${item?.ID}: ${item?.CustomerName}: ${item?.EntryDate}`;
        list.push(obj);
      });
      setVoucherTypeList(list);
    }
    ClearStateSearchFrAdjust();
  }, [Filter?.Cust_Type, isSearchFrAdjustSucc, entityType]);

  useEffect(() => {
    if (
      isSelectedSearchListSucc &&
      Filter?.Cust_Type > 0 &&
      Filter?.HeaderID > 0
    ) {
      setFilteredSearchList([...SelectedSearchList]);
      ClearStateSelectedSearchList();
    }
  }, [
    Filter?.Cust_Type,
    Filter?.HeaderID,
    isSelectedSearchListSucc,
    entityType,
  ]);

  const SelectedDataColumn = [
    { headername: "LotNo", fieldname: "LotNo", type: "text" },
    { headername: "Srl", fieldname: "SRL", type: "number" },
    { headername: "ItemDate", fieldname: "ItemDate", type: "number" },
    { headername: "Mahajon", fieldname: "MahajanName", type: "text" },
  ];

  console.log(Filter?.HeaderID, "Filter?.HeaderID");
  return (
    <Row className="pt-1">
      <Col xl={2} lg={2} md={3} sm={3} xs={8}>
        <h5
          style={{
            fontSize: "normal",
            fontWeight: 600,
            fontFamily: "sans-serif",
            color: "#5c5c5c",
          }}
        >
          Interest Calculation
        </h5>
      </Col>
      <Col xl={9} lg={98} md={8} sm={7} xs={12} className="p-0">
        <Row>
          {entityType ? (
            <>
              {entityType == 3 && (
                <Col>
                  <SelectOption
                    OnSelect={FilterHandler}
                    PlaceHolder={"--Select Cust Type--"}
                    SName={"Cust_Type"}
                    SelectStyle={{
                      padding: "5px 8px",
                    }}
                    Value={Filter?.Cust_Type}
                    sdisabled={false}
                    Soptions={CustTypeList}
                    key={entityType}
                  />
                </Col>
              )}

              <Col>
                <SearchableDropDown
                  defaultval={""}
                  handleChange={FilterHandler}
                  label={"HeaderID"}
                  options={VoucherTypeList}
                  placeholder={"--Select  Voucher --"}
                  selectedVal={Filter?.HeaderID}
                  width={"80%"}
                  directSearch={false}
                  key={entityType}
                />
              </Col>
              <Col>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={OpenFilteredData}
                  disabled={FilteredSearchList.length === 0}
                >
                  <i className="bi bi-funnel fs-3"></i>
                </Button>
              </Col>
            </>
          ) : null}
        </Row>
        <ReusableModal
          show={isViewModeOn}
          Title={"Searched Data"}
          body={
            <>
              <Table tab={FilteredSearchList} Col={SelectedDataColumn} />
            </>
          }
          handleClose={CloseFilteredData}
          SuccessButtonName={"Procced"}
          isSuccess={true}
          handleSuccess={() => {
            handleFilterout();
            CloseFilteredData();
          }}
          isFullScreen={true}
        />
      </Col>
      <Col
        xl={1}
        lg={1}
        md={1}
        sm={2}
        xs={2}
        className="px-2 d-flex justify-content-end float-end"
      >
        <Button variant="link" onClick={onClose} className="p-0">
          <i className="bi bi-x-lg fs-4" style={{ color: "#5c5c5c" }}></i>
        </Button>
      </Col>
      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <hr className="mt-1 mb-2" />
      </Col>
      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <div style={{ height: "85vh", overflow: "auto" }}>
          <table hover className="mb-0" style={{ width: "100%" }}>
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
              {calculationData?.map((group, groupIndex) => (
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
                              row.interfaceName === "Payment" ||
                              row.interfaceName === "Mahajon"
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
                        row.interfaceName === "Payment" ||
                        row.interfaceName === "Mahajon" ? (
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
                          row.interfaceName !== "Payment" ||
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
                          row.interfaceName !== "Payment" ||
                          row.interfaceName !== "Mahajon") &&
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
          </table>{" "}
        </div>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        <hr className="my-1" />
      </Col>
      <Col xs={12} sm={12} md={9} lg={10} xl={11}>
        <div className="d-flex align-items-end justify-content-end flex-wrap my-3">
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
        <div className="d-flex justify-content-end align-items-center my-1">
          <Button
            onClick={() => {
              onSave(calculationData, searchHeaderId);
            }}
            disabled={
              grandTotals.interestCr == 0 && grandTotals?.principalCr == 0
            }
          >
            Submit
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Calculate;
