import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddGroupCost from "../../store/AddStore/useAddGroupCost";
import CostCenterTable from "./CostCenterTable";
import useAddCostCenter from "../../store/AddStore/useAddCostCenter";
import useFetchGroupCost from "../../store/ShowStore/useFetchGroupCost";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function CostCenterListEdit() {
   const inputRef = useRef();
    const [searchData, setSearchData] = useState("");
    useEffect(() => {
      if(inputRef.current){
        inputRef.current.focus();
      }
    },[])
  const [costCenterData, setCostCenterData] = useState({
    CODE: "",
    DESCRIPTION: "",
    TypeSelete: null,
    ParentCode: null,
  });

  // console.log(costCenterData);

  const parentCodeOptions = [
    { label: "Customer", value: 1 },
    { label: "WholeSeller", value: 2 },
  ];

  const [isDisable, setIsDisable] = useState(false);

  const {
    CostCenterError,
    isCostCenterLoading,
    CostCenterSuccess,
    CostCenterAdd,
    ClearStateCostCenterAdd,
  } = useAddCostCenter();
    const { isGroupCostLoading, GroupCostList, fetchGroupCost } =
      useFetchGroupCost();

  const {
    CompanyID,

  } = useFetchAuth();
  // Input change handler
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "TypeSelete") {
      if (GroupCostList.Type == costCenterData.TypeSelete) {
        setCostCenterData((prev) => ({
          ...prev,
          ParentCode: GroupCostList.Type,
        }));
      }
        setCostCenterData((prev) => ({ ...prev, ParentCode: null }));
    }
      setCostCenterData((prev) => ({ ...prev, [name]: value }));
  };

  // Memoized parent code list
  const parentCodeList = useMemo(() => {
    return parentCodeOptions.map((item) => ({
      label: `${item?.label}`,
      value: item?.value,
    }));
  }, [parentCodeOptions]);
  // Memoized parent code list
  const GroupCost = useMemo(() => {
    return GroupCostList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [GroupCostList]);
  // console.log(GroupCostList);

  // Save Data Function
  const SaveData = () => {
    const requiredFields = ["CODE", "DESCRIPTION", "ParentCode"];
    const emptyFields = requiredFields.filter(
      (field) => !costCenterData[field]
    );

    if (emptyFields.length > 0) {
      toast.error(`Please Fill All The Fields`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Proceed with data submission
    CostCenterAdd(costCenterData);
  };
  // Fetch company list when new data is added or item is edited
  useEffect(() => {
    if (costCenterData.TypeSelete != null) {
      fetchGroupCost({ companyId: CompanyID, type: costCenterData.TypeSelete });
    }
  }, [costCenterData.TypeSelete]);

  useEffect(() => {
    if (CostCenterSuccess && !isCostCenterLoading && !CostCenterError) {
      toast.success("Cost Center Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setCostCenterData({
        CODE: "",
        DESCRIPTION: "",
        TypeSelete: null,
        ParentCode: null,
      });
    }

    if (CostCenterError && !isCostCenterLoading && !CostCenterSuccess) {
      toast.error(CostCenterError, { position: "top-right", autoClose: 3000 });
    }

    ClearStateCostCenterAdd();
  }, [isCostCenterLoading, CostCenterSuccess, CostCenterError]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", width: "100%" }}>
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <h5>Cost Center</h5>
          </div>
          <hr className="my-1" />
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
                  <th>Cost Center Code*</th>
                  <th>Description*</th>
                  <th>Select Type*</th>
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
                      placeholder="Cost Center Code"
                      className="input-cell form-input"
                      name="CODE"
                      value={costCenterData?.CODE || ""}
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
                      value={costCenterData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={255}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={parentCodeList}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={costCenterData?.TypeSelete}
                      label={"TypeSelete"}
                      placeholder={"--Select Type--"}
                      key={2}
                      defaultval={-1}
                      width={"100%"}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={GroupCost}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={costCenterData?.ParentCode}
                      label={"ParentCode"}
                      placeholder={"--Select Type--"}
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
              {isCostCenterLoading ? "Please wait..." : "Add"}
            </Button>
          </div>
        </Col>

        {/* Edit Section */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="mt-3 mb-2" />
          <div className="d-flex justify-content-between">
            <h5>Cost Center Edit</h5>
          </div>
          <hr className="my-1" />
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

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <CostCenterTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CostCenterListEdit;
