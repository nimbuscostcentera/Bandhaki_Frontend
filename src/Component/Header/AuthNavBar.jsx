import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import useControlSidebar from "../../store/useControlSidebar";
import { Offcanvas, Nav, Button, Container, Navbar } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Image from "../../Asset/Nimbus_Logo_Transparent_white.png";
import "./authNavBar.css";
import "../../GlobalStyle/GlobalTheme.css";
function AuthNavBar() {
  const { Open } = useControlSidebar();
  useEffect(() => {
    const logoimg = document.getElementById("logoNimbus");
     const head = document.getElementById("head-nav");
    if (!Open)
    {
      head.classList.add("close");
    }
    else {
      head.classList.remove("close");
    }
  },[Open])
  return (
    <nav
      className="navbar px-0 mx-0 d-flex justify-content-between"
      id="head-nav"
    >
      <div>
        <a href="https://www.nimbussystems.co.in/">
          <img
            src={Image}
            alt="Nimbus System Pvt. Ltd."
            id="logoNimbus"
            className={`logoPic`}
          />
        </a>
      </div>
      <div className="">
        <Link to={"/auth/profile"}>
          <i className="bi bi-person-circle white-icon"></i>
        </Link>
        <Link to={"/auth/setup"}>
          <i className="bi bi-gear-fill white-icon"></i>
        </Link>
        <Link>
          <i className="bi bi-bell-fill white-icon"></i>
        </Link>
        <Button
          style={{ padding: 0, margin: 0 }}
          variant="link"
          onClick={() => {
            window.localStorage.clear();
            window.location.reload();
          }}
        >
          <i className="bi bi-box-arrow-right white-icon"></i>
        </Button>
      </div>
    </nav>
  );
}

export default AuthNavBar;
