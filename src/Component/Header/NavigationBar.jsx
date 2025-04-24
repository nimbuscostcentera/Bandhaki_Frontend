import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.min";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import Image from "../../Asset/Nimbus_Logo_Transparent_white.png";

const NavigationBar = () => {
  const [show, setshow] = useState(false);
  const handleClose = () => {
    setshow(false);
  };
  const handleShow = () => {
    setshow(true);
  };
  return (
    <Navbar key={"md"} expand={"md"} className="header header-color py-0 my-0" style={{ width:"100vw"}}>
      <Container fluid className="px-4">
        <Navbar.Brand
          href="https://www.nimbussystems.co.in/"
          style={{ width: "145px" }}
        >
          <img
            src={Image}
            alt="Nimbus System Pvt. Ltd."
            width="100%"
            style={{ padding: "2px 0px" }}
          />
        </Navbar.Brand>

        <Button variant="dark" onClick={handleShow} id="menu">
          <i
            className="bi bi-list"
            style={{ color: "white", fontSize: "30px" }}
          ></i>
        </Button>
        <Offcanvas
          placement="end"
          show={show}
          onHide={handleClose}
          responsive="md"
          className="header-color"
        >
          <Offcanvas.Header className="py-2 px-3" style={{borderBottom:"1px solid white"}}>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">
              Menu
            </Offcanvas.Title>
            <Button variant="dark" onClick={handleClose}>
              <i
                className="bi bi-x-lg"
                style={{ color: "white", fontSize: "20px" }}
              ></i>
            </Button>
          </Offcanvas.Header>
          <hr className="my-1" />
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-4">
              <Nav.Link
                href="https://www.nimbussystems.co.in/contact-us/"
                className="small-link"
              >
                About Us
              </Nav.Link>
              <Nav.Link
                href="https://www.nimbussystems.co.in/about-us/"
                className="small-link"
              >
                contact Us
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};
export default NavigationBar;
