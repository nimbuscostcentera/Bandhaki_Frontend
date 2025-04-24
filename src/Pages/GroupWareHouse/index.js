import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import GroupWareHouseTable from "./GroupWareHouseTable";
import useAddGroupWareHouse from "../../store/AddStore/useAddGroupWareHouse";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function GroupWareHouseListEdit() {
   const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
     }
   }, []);
  const [groupWareHouseData, setGroupWareHouseData] = useState({
    CODE: "",
    DESCRIPTION: "",
  });

  const [isDisable, setIsDisable] = useState(false);
  const { CompanyID } = useFetchAuth();
  // API hooks
  const {
    GroupWareHouseError,
    isGroupWareHouseLoading,
    GroupWareHouseSuccess,
    addGroupWareHouse,
    ClearStateGroupWareHouseAdd,
  } = useAddGroupWareHouse();

  // Handle Input Change
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setGroupWareHouseData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Data
  const SaveData = () => {
    // Validation: Ensure required fields are filled
    const requiredFields = ["CODE", "DESCRIPTION"];
    const emptyFields = requiredFields.filter(
      (field) => !groupWareHouseData[field]
    );

    if (emptyFields.length > 0) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Submit data to API
    addGroupWareHouse({ ...groupWareHouseData, CompanyID: CompanyID });
  };

  // Handle API Response
  useEffect(() => {
    if (
      GroupWareHouseSuccess &&
      !isGroupWareHouseLoading &&
      !GroupWareHouseError
    ) {
      toast.success("Group WareHouse Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setGroupWareHouseData({
        CODE: "",
        DESCRIPTION: "",
      });
    }

    if (
      GroupWareHouseError &&
      !isGroupWareHouseLoading &&
      !GroupWareHouseSuccess
    ) {
      toast.error(GroupWareHouseError, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    ClearStateGroupWareHouseAdd();
  }, [isGroupWareHouseLoading, GroupWareHouseSuccess, GroupWareHouseError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", width: "100%" }}>
        <Col xs={12} style={{ paddingLeft: "15px", margin: "0px" }}>
          <div className="d-flex justify-content-between">
            <h5>Group WareHouse</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>

        {/* Form Section */}
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div style={{ width: "100%", overflow: "auto" }}>
            <table style={{ width: "100%", overflow: "auto" }}>
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
                  <th>Group WareHouse Code*</th>
                  <th>Description*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Group WareHouse Code"
                      className="input-cell form-input"
                      name="CODE"
                      value={groupWareHouseData.CODE}
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
                      value={groupWareHouseData.DESCRIPTION}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={255}
                      style={{ width: "100%" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>

        {/* Submit Button */}
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={SaveData} disabled={isDisable}>
              {isGroupWareHouseLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>

        {/* Table Section */}
        <Col xs={12}>
          <hr className="mt-3 mb-2" />
          <div className="d-flex justify-content-between">
            <h5>Group WareHouse Edit</h5>
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
          <GroupWareHouseTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default GroupWareHouseListEdit;
