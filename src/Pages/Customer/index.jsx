import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetails from "./CustomerDetails";
import AdhaarValidation from "../../GlobalFunctions/AdhaarValidation";
import PanCardValidation from "../../GlobalFunctions/PanCardValidation";
import VoterCardValidation from "../../GlobalFunctions/VoterCardValidation";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useRegCustomer from "../../store/AddStore/useRegCustomer";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import moment from "moment";
import SelectOption from "../../Component/SelectOption";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
function CustListEdit() {
  //-----------------------------------useRef---------------------------------//
  const inputRef = useRef();
  const custref = useRef();
  //---------------------------------useState----------------------------------//
  const [textDetail, setTextDetail] = useState("");
  const [searchData, setSearchData] = useState("");
  const [img, setImage] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const [CustData, setCustData] = useState({
    Name: null,
    ContactNumber: null,
    Address: null,
    DOB: null,
    GurdianName: null,
    IDPROOF_Type: null,
    IDPROOF: null,
    IDPROOF_IMG: null,
    IDProofLength: null,
    FineID: -1,
    timing: 1,
  });
  //--------------------------------API call from Store---------------------------//
  const { CompanyID } = useFetchAuth();

  const {
    InsertCust,
    CustRegSuccess,
    isCustRegLoading,
    CustRegError,
    ClearStateInserCust,
  } = useRegCustomer();

  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();
  //-----------------------------------variables-------------------------------------//
  const SelectOptionIDProof = [
    { Name: "--Select ID Proof--", Value: -1 },
    { Name: "Adhaar Card", Value: "Adhaar Card" },
    { Name: "Voter Card", Value: "Voter Card" },
    { Name: "PAN Card", Value: "PAN Card" },
  ];

  const SelectOptionFineInterestCode = useMemo(() => {
    let frstVal = [{ Name: "--Select Fine Code--", Value: -1 }];
    let fineList = FineHeaderList.map((item) => ({
      Name: `${item?.CODE}`,
      Value: item?.ID,
    }));
    return [...frstVal, ...fineList];
  }, [FineHeaderList]);

  const InterestCalculationTypeList = useMemo(() => {
    let arr = [
      { Name: "--Interest Calculation Type--", Value: -1 },
      { Name: "Date-to-Date", Value: 1 },
      { Name: "Monthly", Value: 2 },
      // { Name: "1st Day of Month", Value: 3 },
    ];
    return arr;
  }, []);
  //--------------------------------------functions-------------------------------------//
  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (
      CustData?.IDPROOF != null &&
      CustData?.IDPROOF != undefined &&
      CustData?.IDPROOF != "" &&
      key == "IDPROOF_Type"
    ) {
      setCustData((prev) => ({ ...prev, ["IDPROOF"]: null }));
    }
    if (CustData?.IDPROOF_Type == "PAN Card" && key == "IDPROOF") {
      setCustData((prev) => ({ ...prev, ["IDProofLength"]: 10 }));
    }
    if (CustData?.IDPROOF_Type == "Voter Card" && key == "IDPROOF") {
      setCustData((prev) => ({ ...prev, ["IDProofLength"]: 10 }));
    }
    if (CustData?.IDPROOF_Type == "Adhaar Card" && key == "IDPROOF") {
      setCustData((prev) => ({ ...prev, ["IDProofLength"]: 12 }));
    }
    setCustData((prev) => ({ ...prev, [key]: value }));
  };
  const OnchangeHandlePic = (e) => {
    let key = e.target.name;
    let files = e.target.files[0];
    setImage(files);
  };
  const SaveData = (e) => {
    e.preventDefault();
    // Destructure CustData for easy validation
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
    } = CustData;

    // Check if any required field is empty or null
    if (!Name || !ContactNumber || !Address) {
      toast.error("Customer Name,Phone No.,Address are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (FineID == -1) {
      toast.error("Select Fine Interest Code!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (CustData?.IDPROOF_Type == "Adhaar Card") {
      let check = AdhaarValidation(CustData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Adhaar Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (CustData?.IDPROOF_Type == "Voter Card") {
      let check = VoterCardValidation(CustData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Voter Card Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (CustData?.IDPROOF_Type == "PAN Card") {
      let check = PanCardValidation(CustData?.IDPROOF);
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
    // console.log(CustData);
    // Proceed to save data if validation passes
    let newformdata = new FormData();
    for (let key in CustData) {
      if (
        CustData[key] !== undefined &&
        CustData[key] !== "" &&
        CustData[key] !== null &&
        CustData[key] !== -1
      ) {
        newformdata.append(key, CustData[key]);
      }
    }
    newformdata.append("IDPROOF_IMG", img);
    newformdata.append("CompanyID", CompanyID);
    InsertCust(newformdata);
  };
  //---------------------------------------useEffect-------------------------------------//

  //auto focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  //finecode fetch
  useEffect(() => {
    fetchFineHeader({ CompanyID, Type: 1 });
  }, []);

  //toaster
  useEffect(() => {
    if (isCustRegLoading && !CustRegSuccess && !CustRegError) {
      toast.play("please wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (CustRegSuccess && !isCustRegLoading && !CustRegError) {
      toast.success("Customer Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        Name: null,
        ContactNumber: null,
        Address: null,
        DOB: null,
        GurdianName: null,
        IDPROOF_Type: null,
        IDPROOF: null,
        IDPROOF_IMG: null,
        FineID: -1,
      });
      custref.current.value = "";
    } else if (CustRegError && !isCustRegLoading && !CustRegSuccess) {
      toast.error(CustRegError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateInserCust();
  }, [isCustRegLoading, CustRegSuccess, CustRegError]);

  return (
    <Container fluid style={{ width: "99%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "50px",marginLeft:"1px", width: "100%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <h5>Add Customer</h5>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
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
                  <th>Customer Name*</th>
                  <th>Phone No.*</th>
                  <th>Address*</th>
                  <th>Interest Type*</th>
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
                      placeholder="Customer Name"
                      className="input-cell form-input"
                      name="Name"
                      value={CustData?.Name || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      ref={inputRef}
                      style={{ width: "150px" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Phone No."
                      className="input-cell"
                      name="ContactNumber"
                      value={CustData?.ContactNumber || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Address"
                      className="input-cell"
                      value={CustData?.Address || ""}
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
                      Value={CustData?.timing}
                      SelectStyle={{ width: "150px", padding: "7px 8px" }}
                      key={1}
                    />
                  </td>
                  <td>
                    {/* <input
                      placeholder="Fine Percentage"
                      name="FineID"
                      className="input-cell"
                      value={CustData?.FineID || ""}
                      onChange={OnChangeHandler}
                      type="number"
                      maxLength={2}
                    /> */}
                    <SelectOption
                      defaultval={-1}
                      OnSelect={OnChangeHandler}
                      SName={"FineID"}
                      Soptions={SelectOptionFineInterestCode}
                      PlaceHolder={"--Select Fine Code--"}
                      Value={CustData?.FineID}
                      SelectStyle={{ width: "150px", padding: "7px 8px" }}
                      key={1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Guardian Name"
                      className="input-cell"
                      value={CustData?.GurdianName || ""}
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
                      value={CustData?.DOB || ""}
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
                      value={CustData?.IDPROOF_Type || ""}
                      onChange={OnChangeHandler}
                      type="text"

                    /> */}
                    <SelectOption
                      defaultval={-1}
                      OnSelect={OnChangeHandler}
                      SName={"IDPROOF_Type"}
                      Soptions={SelectOptionIDProof}
                      PlaceHolder={"--Select ID Proof Type--"}
                      Value={CustData?.IDPROOF_Type}
                      SelectStyle={{ width: "150px", padding: "7px 8px" }}
                      key={1}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="ID Proof No."
                      name="IDPROOF"
                      className="input-cell"
                      value={CustData?.IDPROOF || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={CustData?.IDProofLength}
                      style={{ width: "150px" }}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="ID Proof Image Upload"
                      name="IDPROOF_IMG"
                      className="input-cell"
                      onChange={OnchangeHandlePic}
                      type="file"
                      ref={custref}
                      style={{ width: "150px" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            className="d-flex justify-content-between align-items-center my-1"
            style={{
              height: "100%",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            <div>
              <h5>Customer List</h5>
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
          {/* <hr className="my-1" /> */}
          <div className="d-flex justify-content-between align-items-center  flex-wrap">
            <div className="mt-2 mb-1" style={{ width: "50%" }}>
              <textarea
                value={textDetail}
                readOnly
                type="search"
                placeholder="Detail View"
                style={{
                  width: "100%",
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
          {/* <hr className="my-1" /> */}
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <CustomerDetails
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

export default CustListEdit;
