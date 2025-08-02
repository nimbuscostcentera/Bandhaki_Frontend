import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import WholeSellerDetails from "./WholeSellerDetails";
import AdhaarValidation from "../../GlobalFunctions/AdhaarValidation";
import PanCardValidation from "../../GlobalFunctions/PanCardValidation";
import VoterCardValidation from "../../GlobalFunctions/VoterCardValidation";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useRegWholeSeller from "../../store/AddStore/useRegWholeSeller";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import EmailValidate from "../../GlobalFunctions/EmailValidation";
import moment from "moment";
import SelectOption from "../../Component/SelectOption";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
function WSListEdit() {
  //---------------------------------useRef-------------------------------------//
  const inputRef = useRef();
  const wsref = useRef();
  //-----------------------------------useState-------------------------------------//
  const [textDetail, setTextDetail] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [img, setImage] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [WSData, setWSData] = useState({
    Name: null,
    ContactNumber: null,
    Address: null,
    DOB: null,
    GurdianName: null,
    IDPROOF_Type: null,
    IDPROOF: null,
    IDPROOF_IMG: null,
    IDProofLength: null,
    FineID: 0,
    timing: 2,
  });
  //---------------------------------------------API----------------------------------------//
  const { CompanyID } = useFetchAuth();
  const {
    InsertWS,
    WSRegSuccess,
    isWSRegLoading,
    WSRegError,
    ClearStateInserWS,
  } = useRegWholeSeller();
  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();
  //-------------------------------------function--------------------------------------------//
  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (
      WSData?.IDPROOF != null &&
      WSData?.IDPROOF != undefined &&
      WSData?.IDPROOF != "" &&
      key == "IDPROOF_Type"
    ) {
      setWSData((prev) => ({ ...prev, ["IDPROOF"]: null }));
    }
    if (WSData?.IDPROOF_Type == "PAN Card" && key == "IDPROOF") {
      setWSData((prev) => ({ ...prev, ["IDProofLength"]: 10 }));
    }
    if (WSData?.IDPROOF_Type == "Voter Card" && key == "IDPROOF") {
      setWSData((prev) => ({ ...prev, ["IDProofLength"]: 10 }));
    }
    if (WSData?.IDPROOF_Type == "Adhaar Card" && key == "IDPROOF") {
      setWSData((prev) => ({ ...prev, ["IDProofLength"]: 12 }));
    }
    setWSData((prev) => ({ ...prev, [key]: value }));
  };
  const OnchangeHandlePic = (e) => {
    let key = e.target.name;
    let files = e.target.files[0];
    setImage(files);
  };
  const SaveData = (e) => {
    e.preventDefault();
    // Destructure WSData for easy validation
    const {
      Name,
      ContactNumber,
      Address,
      DOB,
      GurdianName,
      IDPROOF_Type,
      IDPROOF,
      IDPROOF_IMG,
      FineID,
    } = WSData;

    // Check if any required field is empty or null
    if (!Name || !ContactNumber || !Address || !FineID) {
      toast.error("Missing Fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (WSData?.IDPROOF_Type == "Adhaar Card") {
      let check = AdhaarValidation(WSData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Adhaar Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (WSData?.IDPROOF_Type == "Voter Card") {
      let check = VoterCardValidation(WSData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Voter Card Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (WSData?.IDPROOF_Type == "PAN Card") {
      let check = PanCardValidation(WSData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct PAN Card Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (!/^\d{10}$/.test(ContactNumber)) {
      // Check if the phone number is exactly 10 digits
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(ContactNumber)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    console.log(WSData);
    // Proceed to save data if validation passes
    let newformdata = new FormData();
    for (let key in WSData) {
      if (
        WSData[key] !== undefined &&
        WSData[key] !== "" &&
        WSData[key] !== null &&
        WSData[key] !== -1
      ) {
        newformdata.append(key, WSData[key]);
      }
    }
    newformdata.append("IDPROOF_IMG", img);
    newformdata.append("CompanyID", CompanyID);
    InsertWS(newformdata);
  };
  //-------------------------------------useMemo--------------------------------------------//
  const SelectOptionIDProof = [
    { Name: "--Select ID Proof--", Value: -1 },
    { Name: "Adhaar Card", Value: "Adhaar Card" },
    { Name: "Voter Card", Value: "Voter Card" },
    { Name: "PAN Card", Value: "PAN Card" },
  ];
  const SelectOptionFineInterestCode = useMemo(() => {
    let frstVal = [{ Name: "--Select Fine Interest Code--", Value: -1 }];
    let fineList = FineHeaderList.map((item) => ({
      Name: `${item?.CODE}`,
      Value: item?.ID,
    }));
    return [...frstVal, ...fineList];
  }, [FineHeaderList]);
  const InterestCalculationTypeList = useMemo(() => {
    let arr = [
      // { Name: "--Interest Calculation Type--", Value: -1 },
      { Name: "Monthly", Value: 2 },
      // { Name: "1st Day of Month", Value: 3 },
      // { Name: "1st Day of Month", Value: 3 },
    ];
    return arr;
  }, []);
  //--------------------------------------useEffects--------------------------------------//
  //autofocus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  //toaster
  useEffect(() => {
    if (isWSRegLoading && !WSRegSuccess && !WSRegError) {
      toast.play("please wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (WSRegSuccess && !isWSRegLoading && !WSRegError) {
      toast.success("WholeSeller Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setWSData({
        Name: null,
        ContactNumber: null,
        Address: null,
        DOB: null,
        GurdianName: null,
        IDPROOF_Type: null,
        IDPROOF: null,
        IDPROOF_IMG: null,
        FinePercentage: null,
        timing: 2,
      });
      wsref.current.value = "";
    } else if (WSRegError && !isWSRegLoading && !WSRegSuccess) {
      toast.error(WSRegError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateInserWS();
  }, [isWSRegLoading, WSRegSuccess, WSRegError]);
  //fine header api call
  useEffect(() => {
    fetchFineHeader({ CompanyID, Type: 2 });
  }, []);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "50px", marginLeft: "1px", width: "98%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <h5>Wholesaler Add</h5>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div
            className="table-box"
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table>
              <thead className="tab-head">
                <tr>
                  <th
                    style={{
                      padding: "3px 10px",
                      borderBottom: "1px solid lightgrey",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>Wholesaler Name*</th>
                  <th>Phone No.*</th>
                  <th>Address*</th>
                  <th>Interest Type</th>
                  <th>Fine Code*</th>
                  <th>Guardian Name</th>
                  <th>DOB</th>
                  <th>ID Proof Type</th>
                  <th>ID Proof No.</th>
                  <th>ID Proof Image</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Wholesaler  Name"
                      className="input-cell form-input"
                      name="Name"
                      value={WSData?.Name || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "160px" }}
                      ref={inputRef}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Phone No."
                      className="input-cell"
                      name="ContactNumber"
                      value={WSData?.ContactNumber || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Address"
                      className="input-cell"
                      value={WSData?.Address || ""}
                      name="Address"
                      onChange={OnChangeHandler}
                      type="tel"
                      maxLength={250}
                    />
                  </td>
                  <td>
                    <SelectOption
                      defaultval={-1}
                      OnSelect={OnChangeHandler}
                      SName={"timing"}
                      Soptions={InterestCalculationTypeList}
                      PlaceHolder={"--Select Interest Calculation Type--"}
                      Value={WSData?.timing}
                      SelectStyle={{ width: "180px", padding: "7px 8px" }}
                      key={1}
                      sdisabled={true}
                    />
                  </td>
                  <td>
                    <SelectOption
                      defaultval={-1}
                      OnSelect={OnChangeHandler}
                      SName={"FineID"}
                      Soptions={SelectOptionFineInterestCode}
                      PlaceHolder={"--Select Fine Interest Code--"}
                      Value={WSData?.FineID}
                      SelectStyle={{ width: "200px", padding: "7px 8px" }}
                      key={1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Guardian Name"
                      className="input-cell"
                      value={WSData?.GurdianName || ""}
                      name="GurdianName"
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Date of Birth"
                      name="DOB"
                      className="input-cell"
                      value={WSData?.DOB || ""}
                      onChange={OnChangeHandler}
                      type="date"
                      max={moment().add(-18, "years").format("YYYY-MM-DD")}
                    />
                  </td>
                  <td>
                    {/* <input
                      placeholder="IDPROOF_Type"
                      name="IDPROOF_Type"
                      className="input-cell"
                      value={WSData?.IDPROOF_Type || ""}
                      onChange={OnChangeHandler}
                      type="text"

                    /> */}
                    <SelectOption
                      defaultval={-1}
                      OnSelect={OnChangeHandler}
                      SName={"IDPROOF_Type"}
                      Soptions={SelectOptionIDProof}
                      PlaceHolder={"--Select ID Proof Type--"}
                      Value={WSData?.IDPROOF_Type}
                      SelectStyle={{ width: "200px", padding: "7px 8px" }}
                      key={1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="ID Proof No."
                      name="IDPROOF"
                      className="input-cell"
                      value={WSData?.IDPROOF || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={WSData?.IDProofLength}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="ID Proof Image Upload"
                      name="IDPROOF_IMG"
                      className="input-cell"
                      onChange={OnchangeHandlePic}
                      type="file"
                      ref={wsref}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr className="mt-1 mb-0" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            className="d-flex justify-content-between align-items-center mt-1"
            style={{ height: "100%" }}
          >
            <div>
              <h5>Wholesaler Edit</h5>
            </div>
            <div>
              <Button
                variant="success"
                style={{ padding: "1px 9px", display: "block" }}
                onClick={(e) => SaveData(e)}
                disabled={isDisable}
              >
                {/* <i className="bi bi-plus"></i> */}
                Add
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
            <div>
              <textarea
                value={textDetail}
                readOnly
                type="search"
                placeholder="Detail View"
                style={{
                  width: "50vw",
                  border: "1px solid dodgerblue",
                  outline: "1px solid dodgerblue",
                  borderRadius: "5px",
                  padding: "0px 5px",
                }}
              />
            </div>
            <div>
              <label
                className="form-input"
                style={{
                  width: "28vw",
                  border: "1px solid dodgerblue",
                  borderRadius: "5px",
                  padding: "5px",
                  outline: "1px solid dodgerblue",
                  display: "flex",
                  alignItems: "center",
                  // borderColor: "#25a353",
                }}
              >
                <i
                  className="bi bi-search"
                  style={{
                    fontSize: "16px",
                  }}
                ></i>
                <input
                  value={searchData}
                  type="search"
                  placeholder="Search here....."
                  style={{
                    width: "80%",
                    border: "none",
                    outline: "none",
                    padding: "0px 5px",
                  }}
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </label>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px" }}
        >
          <WholeSellerDetails
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            setTextDetail={setTextDetail}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default WSListEdit;
