// import { React, useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import "./profile.css";
// // import photo from "../pic/profile.jpg";
// import photo from "../../Asset/user.png";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.min.css";
// import useFetchAuth from "../../store/Auth/useFetchAuth";
// import usePassReset from "../../store/useResetPass";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Profile = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     passResetSuccess,
//     ispassResetLoading,
//     passResetError,
//     passResetFunc,
//     ClearStatepassReset,
//   } = usePassReset();

//   const { user } = useFetchAuth();
//   const [resetPassData, setResetPassData] = useState({
//     oldpass: "",
//     confirmpass: "",
//     newpass: "",
//   });

//   const handleChange = (e) => {
//     setResetPassData({ ...resetPassData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // console.log(resetPassData)
//     let data = {
//       PhoneNo: user?.PhoneNumber,
//       password: resetPassData?.oldpass,
//       Newpassword: resetPassData?.newpass,
//       ConfirmPass: resetPassData?.confirmpass,
//     };
//     // if(data?.password != data?.NewPass){
//     //   toast.error("confirm password not matching with new password", {
//     //     position: "top-right",
//     //     autoClose: 3000,
//     //   });
//     // }else{
//     //   passResetFunc(data)
//     // }
//     passResetFunc(data);
//   };

//   useEffect(() => {
//     if (ispassResetLoading) {
//       toast.play("pleaes wait...", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//     if (passResetSuccess) {
//       toast.success("password  reset Successfully", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       setResetPassData({
//         oldpass: "",
//         confirmpass: "",
//         newpass: "",
//       });
//     }
//     if (passResetError && !ispassResetLoading && !passResetSuccess) {
//       toast.error(passResetError, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//     ClearStatepassReset();
//   }, [ispassResetLoading, passResetSuccess, passResetError]);

//   return (
//     <Container fluid>
//       <ToastContainer />
//       <Row
//         className="d-flex justify-content-center allign-item-center"
//         style={{
//           height: "80vh",
//           width: "100%",
//           overflow: "scroll",
//           marginTop: "85px",
//           margin: "80px auto",
//         }}
//       >
//         <Col
//           xl={4}
//           lg={4}
//           md={5}
//           sm={12}
//           xs={12}
//           className="text-center border  p-3 leftcolumn"
//           style={{
//             backgroundColor: "whitesmoke",
//           }}
//         >
//           <Row className="m-0 p-0" style={{ width: "100%" }}>
//             <Col xl={12} lg={12} md={4} sm={4} xs={12}>
//               <img
//                 className="img-fluid"
//                 src={photo}
//                 alt="User Profile"
//                 width="80%"
//               />
//             </Col>

//             <Col xl={12} lg={12} md={8} sm={8} xs={12}>
//               <h3 className="mt-3">User</h3>
//               <Row className="border p-2 mx-2">
//                 <Col
//                   xl={12}
//                   lg={12}
//                   md={12}
//                   sm={12}
//                   xs={12}
//                   className="d-flex align-items-center justify-content-between  "
//                 >
//                   <div style={{ marginleft: "50px" }}>
//                     <i
//                       className="bi bi-person-circle"
//                       style={{ color: "blue" }}
//                     ></i>
//                   </div>
//                   <div style={{ marginright: "50px" }}>{user?.Name}</div>
//                 </Col>
//                 <Col
//                   xl={12}
//                   lg={12}
//                   md={12}
//                   sm={12}
//                   xs={12}
//                   className="d-flex align-items-center justify-content-between py-2"
//                 >
//                   <div style={{ width: "fit-content" }}>
//                     <i
//                       className="bi bi-telephone"
//                       style={{ color: "green" }}
//                     ></i>
//                   </div>

//                   <div className="d-flex align-items-center  ">
//                     {user?.PhoneNumber}
//                   </div>
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </Col>

//         <Col
//           className="text-center border  p-5 rightcolumn"
//           style={{ backgroundColor: "whitesmoke", padding: "2px" }}
//           xl={8}
//           lg={8}
//           md={7}
//           sm={12}
//           xs={12}
//         >
//           <h4 className="d-flex align-items-center mt-4">
//             <i className="bi bi-file-lock2 text-purple me-2"></i> Change Your
//             Password
//           </h4>
//           <Form>
//             <Row className="gy-3">
//               <Col xl={12} lg={12} md={12} sm={12} xs={12}>
//                 <Form.Control
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter old password"
//                   name="oldpass"
//                   onChange={handleChange}
//                   value={resetPassData?.oldpass}
//                 />
//               </Col>
//               <Col xl={6} lg={12} md={12} sm={12} xs={12}>
//                 <Form.Control
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter new password"
//                   onChange={handleChange}
//                   name="newpass"
//                   value={resetPassData?.newpass}
//                 />
//                 <Form.Text className="text-muted">
//                   Must include uppercase, lowercase, number, and special
//                   character.
//                 </Form.Text>
//               </Col>
//               <Col xl={6} lg={12} md={12} sm={12} xs={12}>
//                 <Form.Control
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Confirm password"
//                   name="confirmpass"
//                   onChange={handleChange}
//                   value={resetPassData?.confirmpass}
//                 />
//                 <Form.Text className="text-muted">
//                   Must include uppercase, lowercase, number, and special
//                   character.
//                 </Form.Text>
//               </Col>
//               <Col
//                 xs={12}
//                 xl={6}
//                 lg={6}
//                 md={6}
//                 sm={12}
//                 className="d-flex align-items-center"
//               >
//                 <Form.Check
//                   type="checkbox"
//                   label="Show Password"
//                   onChange={() => setShowPassword(!showPassword)}
//                 />
//               </Col>
//               <Col xs={12} className="text-center">
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="mt-3 w-20"
//                   style={{ backgroundColor: "blue", color: "yellow" }}
//                   onClick={handleSubmit}
//                 >
//                   Submit
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//           <h4 className="d-flex align-items-center mt-5">
//             <i className="bi bi-file-person text-info me-2"></i> More Details
//           </h4>
//           <Form>
//             <Row className="gy-3">
//               <Col md={12} xs={12} sm={12} lg={12} xl={6}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Phone Number"
//                   value={user?.PhoneNumber}
//                 />
//               </Col>
//               <Col md={12} xs={12} sm={12} lg={12} xl={6}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Name"
//                   value={user?.Name}
//                 />
//               </Col>
//             </Row>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Profile;
