import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import CityTable from "./CityTable";
import UserTable from "./UserTable";
import useAddUser from "../../store/AddStore/useAddUser";
import SearchableDropDown from "../../Component/SearchableDropDown";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function UserListEdit() {
   const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
     }
   }, []);
  const [CustData, setCustData] = useState({
    Name: null,
    ContactNumber: null,
    Utype: null,
    password: null,
    CompanyID: null
  });
   const { CompanyID } = useFetchAuth();
  const [isDisable, setIsDisable] = useState(false);
  // //console.log(CustData);
  // const { user } = useFetchAuth();
  const {
    InsertUser,
    AddUserSuccess,
    isAddUserLoading,
    AddUserError,
    ClearStateUserAdd,
  } = useAddUser();
  const UtypeOptions = [
    {
      label: "Admin",
      value: 1,
    },
    {
      label: "User",
      value: 2,
    },
  ];

  const OnChangeHandler = (e) => {
    // //console.log(e);
    let key = e.target.name;
    let value = e.target.value;
    setCustData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveData = () => {
    // //console.log(CustData,"userdata")
    if (
      !CustData.Name ||
      !CustData.password ||
      !CustData.ContactNumber ||
      !CustData.Utype
    ) {
      toast.error("All fields are required! ", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!/^\d{10}$/.test(CustData.ContactNumber)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(CustData.ContactNumber)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    InsertUser({ ...CustData, CompanyID: CompanyID });
  };

  //toaster
  useEffect(() => {

    if (AddUserSuccess) {
      toast.dismiss();
      toast.success("User Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({
        Name: null,
        ContactNumber: null,
        Utype: null,
        password: null,
      });
    }
    if (AddUserError) {
      toast.dismiss();
      toast.error(AddUserError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateUserAdd();
  }, [isAddUserLoading, AddUserSuccess, AddUserError]);
  //console.log(isAddUserLoading, "loading");

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
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
              {" "}
              <h5>Add User</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={11}
          lg={10}
          xl={9}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
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
                  <th>Name*</th>
                  <th>Phone Number*</th>
                  <th>Password*</th>
                  <th>User Type*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="User name"
                      className="input-cell form-input"
                      name="Name"
                      value={CustData?.Name || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Phone number"
                      className="input-cell"
                      name="ContactNumber"
                      value={CustData?.ContactNumber || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={10}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="password"
                      className="input-cell"
                      name="password"
                      value={CustData?.password || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={30}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <SearchableDropDown
                      options={UtypeOptions}
                      handleChange={(e) => OnChangeHandler(e)}
                      selectedVal={CustData?.Utype}
                      label={"Utype"}
                      placeholder={"--Select Utype--"}
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
        <Col xs={12} sm={12} md={1} lg={2} xl={3}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button
              variant="success"
              onClick={() => SaveData()}
              disabled={isDisable}
            >
              {isAddUserLoading === true ? "Loading..." : "Add"}
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>Edit User</h5>
              </div>
              <div>
                {`1 : Adimn`}&nbsp;&nbsp;&nbsp;{`2 : user`}
              </div>
            </div>

            <hr className="my-2" />
          </div>
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
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px" }}
        >
          <UserTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default UserListEdit;
