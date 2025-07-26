import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import GroupWareHouseTable from "./GroupWareHouseTable";
import useAddGroupWareHouse from "../../store/AddStore/useAddGroupWareHouse";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchGroupWareHouse from "../../store/ShowStore/useFetchGroupWareHouse";
function GroupWareHouseListEdit() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [newGropuWarehouse, setNewGropuWarehouse] = useState([]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const [groupWareHouseData, setGroupWareHouseData] = useState({
    CODE: "",
    DESCRIPTION: "",
    ParentCode: "",
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
  const { GroupWareHouseList, fetchGroupWareHouse } = useFetchGroupWareHouse();
  // useEffect(() => {
  //   fetchGroupWareHouse({ CompanyID: CompanyID, isTable: false });
  //  },[])
  const ParentCodeOptions = useMemo(() => {
    return GroupWareHouseList?.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [GroupWareHouseList]);
  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "50px", width: "100%" }}>
        <Col xs={12} style={{ paddingLeft: "15px", margin: "0px" }}>
          <div className="d-flex justify-content-between">
            <h5>Group WareHouse</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>

        {/* Form Section */}
        <Col xs={12} sm={6} md={8} lg={9} xl={10}>
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
                <th>Parent WareHouse</th>
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
                    value={groupWareHouseData?.CODE}
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
                    value={groupWareHouseData?.DESCRIPTION}
                    onChange={OnChangeHandler}
                    type="text"
                    maxLength={255}
                    style={{ width: "100%" }}
                  />
                </td>
                <td>
                  <SearchableDropDown
                    options={ParentCodeOptions || []}
                    handleChange={(e) => OnChangeHandler(e)}
                    selectedVal={groupWareHouseData?.ParentCode}
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
        </Col>

        {/* Submit Button */}
        <Col xs={12} sm={6} md={4} lg={3} xl={2}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button variant="success" onClick={SaveData} disabled={isDisable}>
              {isGroupWareHouseLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>

        {/* Table Section */}

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="mt-3 mb-2" />
          <div className=" d-flex justify-content-between align-items-center m-0 flex-wrap">
            <h5>Group WareHouse Edit</h5>
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
          <hr className="mt-2 mb-2" />
          {/* <hr style={{ marginTop: "2px" }} /> */}
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
