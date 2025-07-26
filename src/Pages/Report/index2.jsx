import React, { useState, useEffect } from "react";
import Table from "../../Component/Table";
import { toast, ToastContainer } from "react-toastify";
import { Row, Col, Toast } from "react-bootstrap";

import BongDatePicker from "../../Component/BongDatePicker";
import getReports from "./getReports";
import SearchableDropDown from "../../Component/SearchableDropDown";
import SelectOption from "../../Component/SelectOption";

import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchCustomer from "../../store/ShowStore/useFetchCust";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchTransReport from "../../store/Reports/useFetchTransReport";
import useFetchCostCenter from "../../store/ShowStore/useFetchCostCenter";


function Report() {
  //----------------------------------------------hooks-------------------------------------//
  const [data, setData] = useState([]);
  const [FilteredSearchList, setFilteredSearchList] = useState([]);
  const [AdvanceReportData, setAdvanceReportData] = useState([]);
  const [OutStandingReportData, setOutStandingReportData] = useState([]);
  const [EntityList, setEntityList] = useState([]);
  const [CostCenter, setCostCenter] = useState([]);
  const [Filter, setFilter] = useState({
    Cust_Type: null,
    Cust_ID: null,
    CustName: null,
    StartDate: null,
    EndDate: null,
    view1: false,
    view2: false,
    status: 2,
    CostCenterID:-1
  });
  //-------------------------------------------API Call-------------------------------------//

  const { CompanyID, user } = useFetchAuth();
  const {
    WholeSellerList,
    isLoadingWSList,
    errorWSList,
    ClearWSList,
    fetchWSomrData,
    isWsSuccess,
  } = useFetchWS();
  const {
    CustomerList,
    fetchCustomrData,
    errorCustList,
    isLoadingCustList,
    ClearStateCust,
    isCustSuccess,
  } = useFetchCustomer();
  const {
    MahajonList,
    isLoadingMahajon,
    errorMahajon,
    ClearMahajonList,
    fetchMahajonData,
    isMJSuccess,
  } = useFetchMahajon();
  const {
    isTransReportSucc,
    TransReport,
    AdvanceReport,
    OutStandingReport,
    isTransReportLoading,
    isTransReportError,
    TransReportErrMsg,
    fetchTransReport,
    ClearstateTransReport,
  } = useFetchTransReport();
    const {
      isCostCenterLoading,
      CostCenterList,
      fetchCostCenter,
      isCostCenterSuccess,
    } = useFetchCostCenter();
  //---------------------------------------------function-----------------------------------//
  const handleCloseDatePicker = () => {
    setFilter((prev) => ({ ...prev, view1: false, view2: false }));
  };

  const StartDatePickerOpen = () => {
    setFilter((prev) => ({ ...prev, view1: true }));
  };

  const EndDatePickerOpen = () => {
    setFilter((prev) => ({ ...prev, view2: true }));
  };

  const FilterHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    if (key === "HeaderID" && (value === null || value === undefined)) {
      setFilteredSearchList([]);
    }
    if (key == "Cust_Type") {
      setFilter((prev) => ({ ...prev, [key]: value, HeaderID: -1 }));
      setData([]);
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleDatePicker = (value, name) => {
    let key = name;
    const val = value;
    if (key === "StartDate") {
      key = "StartDate";
    } else if (key === "EndDate") {
      key = "EndDate";
    }
    setFilter((prev) => ({ ...prev, [key]: val }));
  };

  //----------------------------------------useEffect--------------------------------------//
    // Fetch cost center data
    useEffect(() => {
      fetchCostCenter({ CompanyID: CompanyID });
    }, []);
  //report gen
  useEffect(() => {
    if (isTransReportError) {
      toast.error(TransReportErrMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (isTransReportSucc) {
      let arr1 = [],
        arr2 = [],
        arr3 = [];
      TransReport?.map((item, index) => {
        let obj = {};
        item?.prnData?.map((ele, indexprn) => {
          if (indexprn == 0) {
            obj = {
              OpDate: item?.EntryDate,
              EntryDate: ele?.EntryDate,
              LotNo: item?.LotNo,
              SRL: item?.SRL,
              Description: item?.Description,
              Amount: ele?.Amount,
              InterestPencentage: ele?.InterestPencentage,
              prnData: item?.prnData,
              data: item?.data,
            };
          } else {
            obj = {
              OpDate: item?.EntryDate,
              EntryDate: ele?.EntryDate,
              LotNo: item?.LotNo,
              SRL: item?.SRL,
              Amount: ele?.Amount,
              InterestPencentage: ele?.InterestPencentage,
              trans: indexprn + 1,
              Description: `${ele?.Amount} is taken with ${ele?.InterestPencentage}% interest`,
              prnData: item?.prnData,
              data: item?.data,
            };
          }
          arr1.push(obj);
        });
        item?.data?.map((i, indexdata) => {
          obj = {
            OpDate: item?.EntryDate,
            EntryDate: i?.EntryDate,
            LotNo: item?.LotNo,
            SRL: item?.SRL,
            Summary: i?.summary,
            trans: item?.prnData?.length + indexdata + 1,
            prnData: item?.prnData,
            data: item?.data,
          };
          arr1.push(obj);
        });
      });

      setData(TransReport); // Now we're storing the original response structure
      setAdvanceReportData(() => AdvanceReport);
      setOutStandingReportData(() => OutStandingReport);
    }
    ClearstateTransReport();
  }, [isTransReportLoading, isTransReportError, isTransReportSucc]);

  // Initial data load
  useEffect(() => {
    if (user?.CompanyID && Filter?.Cust_Type) {
      if (
        (Filter?.StartDate && !Filter?.EndDate) ||
        (!Filter?.StartDate && Filter?.EndDate)
      ) {
        return;
      } else {
        if (Filter?.Cust_Type == 1) {
          fetchCustomrData({
            CompanyID: user?.CompanyID,
            Cust_Type: Filter?.Cust_Type,
          });
        } else if (Filter?.Cust_Type == 2) {
          fetchWSomrData({
            CompanyID: user?.CompanyID,
            Cust_Type: Filter?.Cust_Type,
          });
        } else if (Filter?.Cust_Type == 3) {
          fetchMahajonData({
            CompanyID: user?.CompanyID,
            Cust_Type: Filter?.Cust_Type,
          });
        }
      }
    }
  }, [Filter?.Cust_Type]);

  useEffect(() => {
    if (Filter?.Cust_Type && Filter?.Cust_ID) {
      fetchTransReport({
        Cust_Type: Filter?.Cust_Type,
        Cust_ID: Filter?.Cust_ID,
        StartDate: Filter?.StartDate,
        EndDate: Filter?.EndDate,
        status: Filter?.status || 2,
      });
    }
  }, [Filter]);

  useEffect(() => {
    if (isCustSuccess && Filter?.Cust_Type == 1) {
      const obj = {
        label: "--Select Customer--",
        value: -1,
      };
      let arr = [{ ...obj }];
      const list = CustomerList?.map((item) => {
        const obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      setEntityList(arr);
      ClearStateCust();
    } else if (isMJSuccess && Filter?.Cust_Type == 3) {
      const obj = {
        label: "--Select Mahajon--",
        value: -1,
      };
      let arr = [{ ...obj }];
      const list = MahajonList?.map((item) => {
        const obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      setEntityList(arr);
      ClearMahajonList();
    } else if (isWsSuccess && Filter?.Cust_Type == 2) {
      const obj = {
        label: "--Select WholeSaler--",
        value: -1,
      };
      let arr = [obj];
      const list = WholeSellerList?.map((item) => {
        let obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      setEntityList(arr);
      ClearWSList();
    }
  }, [Filter?.Cust_Type, isCustSuccess, isMJSuccess, isWsSuccess]);

  useEffect(() => {
    let obj = EntityList?.filter((item) => item?.value == Filter?.Cust_ID);
    setFilter((prev) => ({ ...prev, CustName: obj[0]?.label }));
  }, [Filter?.Cust_ID]);

  useEffect(() => {
    if (!isCostCenterLoading && isCostCenterSuccess) {
       let obj = { Name: "--Select CostCenter--", Value: -1 };
      let arr = [{...obj}];
      CostCenterList?.map((item) => {
       let objelement = {}
        objelement.Name = item?.CODE;
        objelement.Value = item?.ID;
         arr.push(objelement);
     }); 
      console.log(CostCenterList);
      setCostCenter(arr);
    }      
  }, [isCostCenterLoading, isCostCenterSuccess]);

//----------------------------------------constant--------------------------------------//

  const CustTypeList = [
    { Value: -1, Name: "--Select Cust type--" },
    { Value: 1, Name: "Customer" },
    { Value: 2, Name: "WholeSaler" },
    { Value: 3, Name: "Mahajon" },
  ];

  return (
    <Row style={{ paddingTop: "50px", paddingLeft: 3 }} className="g-2">
      <Col xl={7} lg={6} md={3} sm={4} xs={12}>
        <h5 className="mx-1">Reports</h5>
      </Col>
      <Col xl={4} lg={5} md={7} sm={8} xs={12}>
        <BongDatePicker
          startDate={Filter?.StartDate}
          endDate={Filter?.EndDate}
          handleChange={(e, name) => handleDatePicker(e, name)}
          handleClose={handleCloseDatePicker}
          handleOpenEndDate={EndDatePickerOpen}
          handleOpenStartDate={StartDatePickerOpen}
          view1={Filter?.view1}
          view2={Filter?.view2}
          width={"100%"}
        />
      </Col>
      <Col xl={1} lg={1} md={2} sm={12} xs={12}>
        <div
          className="d-flex justify-content-center align-items-center gap-3"
          style={{ width: "100%" }}
        >
          <button
            className="btn btn-primary mx-1"
            onClick={() => {
              getReports(
                data,
                AdvanceReportData,
                OutStandingReportData,
                Filter?.Cust_Type,
                Filter?.CustName
              );
            }}
          >
            <i className="bi bi-printer"></i>
          </button>
          <button
            className="btn btn-danger mx-1"
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                Cust_Type: null,
                Cust_ID: null,
                StartDate: null,
                EndDate: null,
                view1: false,
                view2: false,
                status: 2,
              }));
            }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </Col>

      <Col xl={3} lg={3} md={3} sm={6} xs={12} className="mb-1">
        <SelectOption
          OnSelect={FilterHandler}
          PlaceHolder={"--Select CostCenter--"}
          SName={"CostCenterID"}
          SelectStyle={{
            padding: "7px 8px",
          }}
          Value={Filter?.CostCenterID}
          sdisabled={false}
          Soptions={CostCenter}
        />
      </Col>
      <Col xl={3} lg={3} md={3} sm={6} xs={12} className="mb-1">
        <SelectOption
          OnSelect={FilterHandler}
          PlaceHolder={"--Select Cust Type--"}
          SName={"Cust_Type"}
          SelectStyle={{
            padding: "7px 8px",
          }}
          Value={Filter?.Cust_Type}
          sdisabled={false}
          Soptions={CustTypeList}
          key={1}
        />
      </Col>
      <Col xl={3} lg={3} md={3} sm={6} xs={12} className="mb-1">
        <SearchableDropDown
          options={EntityList}
          handleChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              Cust_ID: e?.target?.value,
            }))
          }
          SelectStyle={{
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          selectedVal={Filter?.Cust_ID || ""}
          label={"Cust_ID"}
          placeholder={`--Select Name --`}
          key={2}
          defaultval={-1}
        />
      </Col>

      <Col xl={3} lg={3} md={3} sm={6} xs={12}>
        <SelectOption
          OnSelect={(e) =>
            setFilter((prev) => ({
              ...prev,
              status: e?.target?.value,
            }))
          }
          SelectStyle={{
            width: "99%",
            padding: "7px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
          PlaceHolder={"--Select Status--"}
          SName={"Status"}
          Value={Filter?.status}
          Soptions={[
            { Name: "All", Value: -1 },
            { Name: "Running", Value: 2 },
            { Name: "Closed", Value: 1 },
          ]}
        />
      </Col>

      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <hr className="my-1" />
      </Col>

      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        {data?.length > 0 ? (
          <div>
            {data.map((item, index) => (
              <div key={index} className="mb-4">
                {/* Header for the item */}

                {/* Tables side by side */}
                <div className="d-flex justify-content-between flex-wrap">
                  {/* PRN Data Table */}
                  <div
                    className="table-responsive px-2"
                    style={{ width: "55%", minWidth: "300px" }}
                  >
                    <table className="table table-striped table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th style={{ textAlign: "center", width: "80px" }}>
                            Date
                          </th>
                          <th style={{ textAlign: "center" }}>LotNo</th>
                          <th style={{ textAlign: "center" }}>SRL</th>
                          <th style={{ textAlign: "center" }}>Desc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.prnData?.map((prn, prnIndex) => (
                          <tr key={`prn-${index}-${prnIndex}`}>
                            <td
                              style={{
                                padding: "1px 3px",
                                textAlign: "center",
                              }}
                            >
                              {item.EntryDate}
                            </td>
                            <td style={{ padding: "1px 3px" }}>{item.LotNo}</td>
                            <td style={{ textAlign: "center" }}>{item.SRL}</td>
                            <td style={{ padding: "1px 3px" }}>
                              {prnIndex == 0 ? (
                                item.Description + ". ( "
                              ) : (
                                <b>Again Principle </b>
                              )}
                              <b>
                                Rs.{prn.Amount}/- is taken on {prn.EntryDate}{" "}
                                with interest {prn.InterestPencentage}%{" "}
                                {prnIndex == 0 ? ")" : ""}
                              </b>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Transaction Data Table */}
                  <div
                    className="table-responsive px-2"
                    style={{ width: "45%", minWidth: "300px" }}
                  >
                    <table className="table table-striped table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th style={{ textAlign: "center" }}>Date</th>
                          <th style={{ textAlign: "center" }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.data?.map((trans, transIndex) => (
                          <tr key={`trans-${index}-${transIndex}`}>
                            <td style={{ textAlign: "center" }}>
                              {trans.EntryDate}
                            </td>
                            <td style={{ width: "30vw", padding: "1px 3px" }}>
                              {trans.summary}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Separator line between items */}
                {index < data.length - 1 && <hr className="my-3" />}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25"
            style={{ height: "70vh" }}
          >
            <div className="text-muted">
              Use the filters to find ledger data
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default Report;
