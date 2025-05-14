import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImgLogo from "../../../Asset/nimbussystems_logo.jfif";

import InputBox from "../../../Component/InputBox";
import SubmitButton from "../../../Component/SubmitButton";
import CheckBox from "../../../Component/CheckBox";

import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./Login.css";
import "../../../Component/DotLoader/index.css";

import useFetchAuth from "../../../store/Auth/useFetchAuth";

function LoginPage() {
  const navigate = useNavigate();
  const {
    AuthError,
    isAuthError,
    isAuthLoading,
    token,
    CompanyID,
    isAuthSuccess,
    login,
    clearStateAuth,
  } = useFetchAuth();
  //states
  const [showPass, setShowPass] = useState(false);

  const [data, setData] = useState({
    ContactNumber: null,
    password: null,
  });
  // //console.log(userInfo,)

  useEffect(() => {
    if (isAuthSuccess && token) {
      navigate("/auth/manager/company");
    } else if (isAuthError && !isAuthLoading && !isAuthSuccess) {
      toast.error(AuthError, { autoClose: 4000, position: "top-right" });
    }
    clearStateAuth();
  }, [isAuthError, token]);

  useEffect(() => {
    const getToken = JSON.parse(localStorage.getItem("auth-storage"));
    const Token = getToken?.state?.token;
    if (Token) {
      navigate("/auth/manager/company");
    }
  }, []);

  //functions
  const InputHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let string = value.trimStart();
    setData((prev) => ({ ...prev, [key]: string }));
  };

  const SubmitHandler = async (event) => {
    event.preventDefault();
    await login(data);
  };

  return (
    <Container
      fluid
      style={{
        width: "100vw",
        height: "95vh",
        padding: 0,
        margin: 0,
      }}
    >
      <ToastContainer />
      <div className="formWrapper" style={{ width: "100%" }}>
        <div
          className="form-layout mt-4 pt-2 pb-3 px-3"
          style={{ width: "60vh" }}
        >
          <div className="d-flex justify-content-center align-items-center">
            <img src={ImgLogo} width="20%" />
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <p className="mt-1 fs-5 fw-normal color-header">Bandhaki Systems</p>
          </div>
          <form className="px-3">
            <InputBox
              Icon={<i className="bi bi-telephone fs-5"></i>}
              type={"text"}
              label={"ContactNumber"}
              placeholder={"Mobile Number"}
              onChange={(e) => {
                InputHandler(e);
              }}
              Name={"ContactNumber"}
              error={false}
              errorMsg={"Enter Correct Phone Number"}
              maxlen={10}
              marginYClass="my-3"
              value={data?.ContactNumber}
            />
            <InputBox
              Icon={<i className="bi bi-key fs-5"></i>}
              type={showPass ? "text" : "password"}
              label={"password"}
              placeholder={"password"}
              onChange={InputHandler}
              Name={"password"}
              error={false}
              errorMsg={""}
              maxlen={16}
              value={data?.password}
            />
            <div className="d-flex justify-content-between align-items-center flex-wrap px-1 mt-3">
              <CheckBox
                Label={"Show password"}
                onChange={(e) => {
                  setShowPass(!showPass);
                }}
              />
              {/* <div className="mx-2 mt-1">
                <Link to="/resetpass">Forgot password ?</Link>
              </div> */}
            </div>
            <div className="my-3">
              <SubmitButton
                OnClickBtn={SubmitHandler}
                type={"submit"}
                isdisable={
                  !(
                    data?.ContactNumber !== "" &&
                    data?.ContactNumber !== null &&
                    data?.password !== null &&
                    data?.password !== ""
                  )
                }
                isLoading={isAuthLoading}
              />
            </div>
          </form>
        </div>{" "}
      </div>
    </Container>
  );
}

export default LoginPage;
