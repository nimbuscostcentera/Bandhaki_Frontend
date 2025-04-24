import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImgLogo from "../../../Asset/nimbussystems_logo.jfif";

import InputBox from "../../../Component/InputBox";
import SubmitButton from "../../../Component/SubmitButton";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

import "./Reset.css";
import { Container } from "react-bootstrap";

import useFetchReset from "../../../store/Auth/useResetPass";
function ResetPage() {
  const navigate = useNavigate();
  //states
  const [showPass, setShowPass] = useState(false);
  const [inputVal, setInputVal] = useState({
    company_mobile: true,
    password: true,
    updatedPass: true,
  });
  const [data, setData] = useState({
    company_mobile: null,
    password: null,
    updatedPass: null,
  });

  //useEffects
  //   useEffect(() => {
  //     //console.log(isSuccess , !isloading, !isError);

  //     if (isSuccess && !isloading && !isError) {
  //         toast.success(userInfo.message, { autoClose: 4000, position: "top-right" });
  //         dispatch(ClearState());
  //         setTimeout(() => {
  //             navigate("/");
  //         }, 2000);
  //   } else if (isError && !isloading && !isSuccess) {
  //     toast.error(error, { autoClose: 6000, position: "top-right" });
  //   }
  // }, [isSuccess, isError, isloading]);

  //functions
  const InputHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let string = value.trimStart();
    setData({ ...data, [key]: string });
  };

  const SubmitHandler = (event) => {
    event.preventDefault();
    let newFormdata = new FormData();
    Object.keys(data).map((key) => {
      //console.log(key, data[key]);
      newFormdata.set(key, data[key]);
    });
    for (var pair of newFormdata.entries()) {
      //console.log(pair[0] + ":" + pair[1]);
    }
    //dispatch(resetpass(newFormdata));
  };

  return (
    <Container
      fluid
      style={{
        width: "100%",
        height: "95vh",
      }}
    >
      <ToastContainer />
      <div className="formWrapper">
        <div className="form-layout mt-4 pt-2 pb-3 px-3">
          <div className="d-flex justify-content-center align-items-center">
            <img src={ImgLogo} width="20%" />
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <p className="mt-1 fs-5 fw-normal color-header">Reset Password</p>
          </div>
          <form className="px-3">
            <InputBox
              Icon={<i className="bi bi-telephone fs-5"></i>}
              type={"text"}
              label={"company_mobile"}
              placeholder={"Mobile Number"}
              onChange={(e) => {
                InputHandler(e);
              }}
              Name={"company_mobile"}
              error={false}
              errorMsg={"Enter Correct Phone Number"}
              maxlen={10}
            />
            <InputBox
              Icon={<i className="bi bi-key fs-5"></i>}
              type={showPass ? "text" : "password"}
              label={"Old password"}
              placeholder={"Old password"}
              onChange={InputHandler}
              Name={"password"}
              error={false}
              errorMsg={""}
              maxlen={10}
            />
            <div className="mt-3">
              <InputBox
                Icon={<i className="bi bi-key fs-5"></i>}
                type={showPass ? "text" : "password"}
                label={"New password"}
                placeholder={"New password"}
                onChange={InputHandler}
                Name={"updatedPass"}
                error={false}
                errorMsg={""}
                maxlen={16}
              />
            </div>
            {/* <div className="d-flex justify-content-between align-items-center flex-wrap px-1 mt-3">
              <CheckBox
                Label={"Show password"}
                onChange={(e) => {
                  setShowPass(!showPass);
                }}
              />
              <div className="mx-2 mt-1">
                <a href="#">Forgot password ?</a>
              </div>
            </div> */}
            <div className="my-3">
              <SubmitButton
                OnClickBtn={SubmitHandler}
                type={"submit"}
                isdisable={
                  !(
                    data?.company_mobile !== "" &&
                    data?.company_mobile !== null &&
                    data?.password !== null &&
                    data?.password !== "" &&
                    data?.updatedPass !== null &&
                    data?.updatedPass !== "" &&
                    data?.updatedPass !== data?.password
                  )
                }
              />
            </div>
          </form>
        </div>{" "}
      </div>
    </Container>
  );
}

export default ResetPage;
