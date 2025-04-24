import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import GoldRateTable from "./GoldRateTable";
// import useFetchPurity from "../../store/ShowStore/useFetchPurity";
import useAddGoldRate from "../../store/AddStore/useAddGoldRate";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function GoldRateListEdit() {
   const inputRef = useRef();

   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
     }
   }, []);
    const { CompanyID } = useFetchAuth();
  const [goldRateData, setGoldRateData] = useState({
    CompanyID: CompanyID, // Assuming fixed for now
    GOLD_RATE: "",
  });
    const [searchData, setSearchData] = useState("");
// console.log(goldRateData);
  const [isDisable, setIsDisable] = useState(false);

  // Fetch Purity List
  // const { PurityList, fetchPurityMaster } = useFetchPurity();

  const {
    GoldRateError,
    isGoldRateLoading,
    GoldRateSuccess,
    addGoldRate,
    ClearStateGoldRateAdd,
  } = useAddGoldRate();

  // Convert PurityList to dropdown options
  // const PurityFetchList = useMemo(() => {
  //   return PurityList.map((item) => ({
  //     label: `${item?.PURITY}`,
  //     value: item?.ID,
  //   }));
  // }, [PurityList]);
const validateGoldRate = (value) => {
  const regex = /^\d{0,10}(\.\d{0,2})?$/; // 5 digits before decimal, up to 2 digits after
  return regex.test(value);
};
  // Handle Input Change
const OnChangeHandler = (e) => {
  const { name, value } = e.target;

  if (name === "GOLD_RATE") {
    if (validateGoldRate(value)) {
      setGoldRateData((prev) => ({ ...prev, [name]: value }));
    }
  } else {
    setGoldRateData((prev) => ({ ...prev, [name]: value }));
  }
};
  // Fetch Purity List on component mount
  // useEffect(() => {
  //   fetchPurityMaster({ CompanyID: CompanyID });
  // }, []);

  // Save Data
  const SaveData = () => {
    // Validation: Ensure all required fields are filled
    const requiredFields = ["CompanyID",  "GOLD_RATE"];
    const emptyFields = requiredFields.filter((field) => !goldRateData[field]);

    if (emptyFields.length > 0) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Add current date before sending the request
    const requestData = { ...goldRateData };

    addGoldRate(requestData);
  };

  // Handle API Response
  useEffect(() => {
    if (GoldRateSuccess && !isGoldRateLoading && !GoldRateError) {
      toast.success("Gold Rate Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setGoldRateData({
        CompanyID: 1,
        GOLD_RATE: "",
      });
    }

    if (GoldRateError && !isGoldRateLoading && !GoldRateSuccess) {
      toast.error(GoldRateError, { position: "top-right", autoClose: 3000 });
    }

    ClearStateGoldRateAdd();
  }, [isGoldRateLoading, GoldRateSuccess, GoldRateError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", width: "100%" }}>
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <h5>Gold Rate Management</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>

        {/* Form Section */}
        <Col xs={12} sm={12} md={10} lg={10} xl={9}>
          <div style={{ width: "40%", overflow: "auto" }}>
            <table style={{ width: "100%", overflow: "auto" }}>
              <thead className="tab-head">
                <tr>
                  <th>
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>Gold Rate (₹/gm)*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Gold Rate (₹)"
                      className="input-cell form-input"
                      name="GOLD_RATE"
                      value={goldRateData?.GOLD_RATE || ""}
                      onChange={OnChangeHandler}
                      type="number"
                      min="0"
                      step="0.01"
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={SaveData} disabled={isDisable}>
              {isGoldRateLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>

        {/* Submit Button */}
        {/* <Col xs={12} sm={12} md={2} lg={2} xl={3}></Col> */}

        {/* Edit Section */}
        <Col xs={12}>
          <hr className="mt-3 mb-2" />
          <div className="d-flex justify-content-between">
            <h5>Gold Rate Edit</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
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
                  class="bi bi-search"
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

        <Col xs={12}>
          <GoldRateTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default GoldRateListEdit;
