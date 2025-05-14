import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import CompanyTable from "./CompanyTable";
import useAddCompany from "../../store/AddStore/useAddCompany";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import EmailValidation from "../../GlobalFunctions/EmailValidation";
import PanCardValidation from "../../GlobalFunctions/PanCardValidation";

function CompanyListEdit() {
  const inputRef = useRef();
  const [textDetail, setTextDetail] = useState("");
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const [companyData, setCompanyData] = useState({
    CompanyName: "",
    ContactNumber: "",
    Email: "",
    Website: "",
    Logo: "",
    DefaultFinePercentage: "",
    GSTIN: "",
    PAN: "",
    Address: "",
  });
  const [searchData, setSearchData] = useState("");
  // console.log(companyData);
  const [isDisable, setIsDisable] = useState(false);

  // const { user } = useFetchAuth();
  const {
    CompanyRegError,
    isCompanyRegLoading,
    CompanyRegSuccess,
    CompanyReg,
    ClearStateCompanyAdd,
  } = useAddCompany();

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setCompanyData((prev) => ({ ...prev, [key]: value }));
  };
  // Save Data
  const SaveData = () => {
    // Validation: Check if required fields are filled
    const requiredFields = [
      "CompanyName",
      "ContactNumber",
      "Email",
      "GSTIN",
      "PAN",
      "Address",
    ];
    const emptyFields = requiredFields.filter((field) => !companyData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Please fill: ${emptyFields.join(", ")}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^\d{10}$/.test(companyData.ContactNumber)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(companyData.ContactNumber)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!EmailValidation(companyData.Email)) {
      toast.error("Invalid Email Id!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let check = PanCardValidation(companyData?.PAN);
    if (!check) {
      toast.error("Enter Correct PAN Card Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Proceed with data submission
    CompanyReg({ ...companyData });
  };

  useEffect(() => {
    if (CompanyRegSuccess && !isCompanyRegLoading && !CompanyRegError) {
      toast.success("Company Registration Successfull", {
        position: "top-right",
        autoClose: 3000,
      });
      setCompanyData({
        CompanyName: "",
        ContactNumber: "",
        Email: "",
        Website: "",
        Logo: "",
        DefaultFinePercentage: "",
        GSTIN: "",
        PAN: "",
        Address: "",
      });
    }
    if (CompanyRegError && !isCompanyRegLoading && !CompanyRegSuccess) {
      toast.error(CompanyRegError, { position: "top-right", autoClose: 3000 });
    }

    ClearStateCompanyAdd();
  }, [isCompanyRegLoading, CompanyRegSuccess, CompanyRegError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "58px", marginLeft: "3px", width: "100%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <h5 className="mt-2">Company Registration</h5>
            </div>
          </div>
          <hr className="mt-0 mb-2" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            className="table-box"
            style={{
              width: "98%",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100vw",
                overflow: "auto",
              }}
            >
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
                  <th>Company Name*</th>
                  <th>Phone No*</th>
                  <th>Email*</th>
                  <th>GSTIN*</th>
                  <th>PAN No*</th>
                  <th>Address*</th>
                  <th>Fine %</th>
                  <th>Website</th>
                  <th>Logo</th>
                </tr>
              </thead>

              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td style={{ width: "180px" }}>
                    <input
                      placeholder="Company Name"
                      className="input-cell form-input"
                      name="CompanyName"
                      value={companyData?.CompanyName || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                  <td style={{ width: "130px" }}>
                    <input
                      placeholder="Phone No"
                      className="input-cell"
                      name="ContactNumber"
                      value={companyData?.ContactNumber || ""}
                      onChange={OnChangeHandler}
                      type="tel"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "180px" }}>
                    <input
                      placeholder="Email"
                      className="input-cell"
                      name="Email"
                      value={companyData?.Email || ""}
                      onChange={OnChangeHandler}
                      type="email"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>

                  <td style={{ width: "150px" }}>
                    <input
                      placeholder="GSTIN"
                      className="input-cell"
                      name="GSTIN"
                      value={companyData?.GSTIN || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "140px" }}>
                    <input
                      placeholder="PAN"
                      className="input-cell"
                      name="PAN"
                      value={companyData?.PAN || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "280px" }}>
                    <input
                      placeholder="Address"
                      className="input-cell"
                      name="Address"
                      value={companyData?.Address || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={300}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "100px" }}>
                    <input
                      placeholder="Fine Percentage"
                      className="input-cell"
                      name="DefaultFinePercentage"
                      value={companyData?.DefaultFinePercentage || ""}
                      onChange={OnChangeHandler}
                      type="number"
                      maxLength={2}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "150px" }}>
                    <input
                      placeholder="Website Link"
                      className="input-cell"
                      name="Website"
                      value={companyData?.Website || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ width: "170px" }}>
                    <input
                      placeholder="Logo URL"
                      className="input-cell"
                      name="Logo"
                      value={companyData?.Logo || ""}
                      onChange={OnChangeHandler}
                      type="file"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-end align-items-center mt-2">
            <Button
              variant="success"
              onClick={() => SaveData()}
              disabled={isDisable}
            >
              {isCompanyRegLoading ? "Please wait..." : "Register"}
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <h5>Company Edit</h5>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
            <div>
              <textarea
                value={textDetail}
                type="search"
                readOnly
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
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <CompanyTable
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

export default CompanyListEdit;
