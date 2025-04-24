import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./LoginHeader.css";
import img from "../../Asset/Nimbus_Logo_Transparent_white.png";
import { useNavigate, NavLink } from "react-router-dom";
function AuthLayoutWrapper() {
  return (
    <nav className="navbar navbar-expand-lg stickey-top">
      <div className="container-fluid ">
        <div className="px-3" style={{ width: "280px" }}>
          <a className="navbar-brand" href="https://www.nimbussystems.co.in/">
            <img src={img} alt="Nimbus System Pvt. Ltd." width="65%" />
          </a>
        </div>

        <button
          className="navbar-toggler border border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" id="menu-button"></i>
        </button>

        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Offcanvas
            </h5>
            <button
              type="button"
              className="offcanvas-button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <bi className="bi bi-x-lg" style={{fontSize:"20px"}}></bi>
            </button>
          </div>
          <div className="vanising-div">
            <hr/>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <NavLink
                  id="Admin-panel"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                  to="https://www.nimbussystems.co.in/about-us/"
                  end
                >
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  id="Admin-panel"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                  to="https://www.nimbussystems.co.in/contact-us/"
                  end
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AuthLayoutWrapper;
