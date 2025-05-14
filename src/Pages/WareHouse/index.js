import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";

// import useFetchAuth from "../../store/Auth/useFetchAuth";
import SearchableDropDown from "../../Component/SearchableDropDown";

import useAddCostCenter from "../../store/AddStore/useAddCostCenter";
import useFetchGroupCost from "../../store/ShowStore/useFetchGroupCost";
import WareHouseTable from "./WareHouseTable";
import useAddWareHouse from "../../store/AddStore/useAddWareHouse";
import useFetchGroupWareHouse from "../../store/ShowStore/useFetchGroupWareHouse";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function WareHouseListEdit() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const { CompanyID } = useFetchAuth();
  const [warehouseData, setWarehouseData] = useState({
    CODE: "",
    DESCRIPTION: "",
    ParentCode: null,
    CompanyID: CompanyID, // Assuming it's fixed for now
  });

  const [isDisable, setIsDisable] = useState(false);

  // Fetch GroupWareHouse data
  //   const { isGroupWareHouseLoading, GroupWareHouseList, fetchGroupWareHouse } =
  //     useFetchGroupWareHouse();

  const {
    WareHouseError,
    isWareHouseLoading,
    WareHouseSuccess,
    WareHouseAdd,
    ClearStateWareHouseAdd,
  } = useAddWareHouse();
  const { GroupWareHouseList, fetchGroupWareHouse } = useFetchGroupWareHouse();
  useEffect(() => {
    fetchGroupWareHouse({ CompanyID: CompanyID, isTable: true });
  }, []);
  // Convert GroupWareHouseList to ParentCode options
  const ParentCodeOptions = useMemo(() => {
    return GroupWareHouseList.map((item) => ({
      label: `${item?.CODE}:${item?.DESCRIPTION}`,
      value: item?.ID,
    }));
  }, [GroupWareHouseList]);

  // Handle Input Change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setWarehouseData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch Parent Code data on component mount
  //   useEffect(() => {
  //     fetchGroupWareHouse({ companyId: warehouseData.CompanyID });
  //   }, []);

  // Save Data
  const SaveData = () => {
    const requiredFields = ["CODE", "DESCRIPTION", "ParentCode", "CompanyID"];
    const emptyFields = requiredFields.filter((field) => !warehouseData[field]);

    if (emptyFields.length > 0) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    WareHouseAdd(warehouseData);
  };

  // Handle API Response
  useEffect(() => {
    if (WareHouseSuccess && !isWareHouseLoading && !WareHouseError) {
      toast.success("Warehouse Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setWarehouseData({
        CODE: "",
        DESCRIPTION: "",
        ParentCode: null,
        CompanyID: 1,
      });
    }

    if (WareHouseError && !isWareHouseLoading && !WareHouseSuccess) {
      toast.error(WareHouseError, { position: "top-right", autoClose: 3000 });
    }

    ClearStateWareHouseAdd();
  }, [isWareHouseLoading, WareHouseSuccess, WareHouseError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", width: "100%" }}>
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <h5>Warehouse Management</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>

        {/* Form Section */}
        <Col xs={12} sm={12} md={12} lg={11} xl={10}>
          <div style={{ width: "100%", overflow: "auto" }}>
            <table style={{ width: "100%", overflow: "auto" }}>
              <thead className="tab-head">
                <tr>
                  <th>
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>Warehouse Code*</th>
                  <th>Description*</th>
                  <th>Parent Code*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Warehouse Code"
                      className="input-cell form-input"
                      name="CODE"
                      value={warehouseData?.CODE || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Description"
                      className="input-cell"
                      name="DESCRIPTION"
                      value={warehouseData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={255}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={ParentCodeOptions}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={warehouseData?.ParentCode}
                      label={"ParentCode"}
                      placeholder={"--Select Parent Code--"}
                      key={2}
                      defaultval={-1}
                      width={"100%"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>

        {/* Submit Button */}
        <Col xs={12} sm={12} md={12} lg={1} xl={2}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={SaveData} disabled={isDisable}>
              {isWareHouseLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>

        {/* Edit Section */}
        <Col xs={12}>
          <hr className="mt-3 mb-2" />
          <div className="d-flex justify-content-between">
            <h5>Warehouse Edit</h5>
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

        <Col xs={12}>
          <WareHouseTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default WareHouseListEdit;
