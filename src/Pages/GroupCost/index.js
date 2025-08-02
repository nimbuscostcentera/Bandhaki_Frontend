import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";

// import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddItem from "../../store/AddStore/useAddItem";

import useAddCompany from "../../store/AddStore/useAddCompany";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import EmailValidation from "../../GlobalFunctions/EmailValidation";
import useFetchCompany from "../../store/ShowStore/useFetchCompany";
import GroupCostTable from "./GroupCostTable";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function GroupCostListEdit() {
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const { CompanyID } = useFetchAuth();
  const [groupcostData, setGroupCostData] = useState({
    CompanyID: null,
    Type: null,
    CODE: "",
  });
  // console.log(groupcostData);
  const [searchData, setSearchData] = useState("");
  const typeArr = [
    { label: 1, value: "Customer" },
    { label: 2, value: "WholeSeller" },
    { label: 3, value: "Mahajon" },
  ];
  // console.log(companyData);
  const [isDisable, setIsDisable] = useState(false);

  // const { user } = useFetchAuth();
  const {
    GroupCostError,
    isGroupCostLoading,
    GroupCostSuccess,
    GroupCostAdd,
    ClearStateGroupCostAdd,
  } = useAddGroupCost();

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setGroupCostData((prev) => ({ ...prev, [key]: value }));
  };

  //company list

  const typeList = useMemo(() => {
    return typeArr.map((item) => ({
      label: `${item?.value}`,
      value: item?.label,
    }));
  }, [typeArr]);

  // Save Data
  const SaveData = () => {
    // Validation: Check if required fields are filled
    const requiredFields = ["CODE", "Type"];
    const emptyFields = requiredFields.filter((field) => !groupcostData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Please Fill All The Fields`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Proceed with data submission
    GroupCostAdd({ ...groupcostData, CompanyID: CompanyID });
  };
  useEffect(() => {
    if (GroupCostSuccess && !isGroupCostLoading && !GroupCostError) {
      toast.success("Group CostCenter Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setGroupCostData({
        CompanyID: null,
        Type: null,
        CODE: "",
      });
    }
    if (GroupCostError && !isGroupCostLoading && !GroupCostSuccess) {
      toast.error(GroupCostError, { position: "top-right", autoClose: 3000 });
    }

    ClearStateGroupCostAdd();
  }, [isGroupCostLoading, GroupCostSuccess, GroupCostError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "50px", width: "100%" }}>
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
              <h5>Group CostCenter</h5>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
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
                  <th>Group CostCenter Code*</th>
                  <th>Type*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Group CostCenter Code"
                      className="input-cell form-input"
                      name="CODE"
                      value={groupcostData?.CODE || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={typeList}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={groupcostData?.Type}
                      label={"Type"}
                      placeholder={"--Select Type--"}
                      key={1}
                      defaultval={-1}
                      width={"100%"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button
              variant="success"
              onClick={() => SaveData()}
              disabled={isDisable}
            >
              {isGroupCostLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="mt-3 mb-2" />
          <div className=" d-flex justify-content-between align-items-center m-0 flex-wrap">
            <h5>Group CostCenter Edit</h5>
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
          {/* <hr style={{ marginTop: "2px" }} /> */}
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <hr className="my-1" /> */}
          <div className="d-flex justify-content-between align-items-center m-0 flex-wrap"></div>
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
          <GroupCostTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default GroupCostListEdit;
