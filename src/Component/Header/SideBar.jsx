import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./authNavBar.css";
import "../../GlobalStyle/GlobalTheme.css";
import useControlSidebar from "../../store/useControlSidebar";
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Import Tooltip from react-bootstrap

function SideBar() {
  const { Open, CloseSideBarMenu, OpenSideBarMenu } = useControlSidebar();
  const [show, setShow] = useState(false);

  function toggleNav() {
    setShow(!show);
    const titlediv = document.getElementById("title-div");
    const title = document.getElementById("title-h");
    const sidebar = document.getElementById("mySidebar");
    if (Open) {
      CloseSideBarMenu();
      title.classList.add("close");
      titlediv.classList.add("close");
      sidebar.classList.add("close");
    } else {
      OpenSideBarMenu();
      title.classList.remove("close");
      titlediv.classList.remove("close");
      sidebar.classList.remove("close");
    }
  }

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>; // Use Tooltip from react-bootstrap

  return (
    <div className="sidebar" id="mySidebar">
      {/**Menu Header */}
      <div className="sidebar-header" id="title-div">
        <h6 className="sidebar-title" id="title-h">
          Menu
        </h6>
        <button className="toggle-btn" onClick={toggleNav}>
          <i className="bi bi-list"></i>
        </button>
      </div>
      <div style={{ padding: "0" }}>
        {/** Report */}
        <details>
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("All Reports")}
            >
              <i
                className="bi bi-graph-up me-2"
                style={{ fontSize: "20px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>All Reports</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/report"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Report")}
              >
                <i className="bi bi-graph-up-arrow ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Report</span>}
            </Link>
          </div>
        </details>

        {/** Manage Customer */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage Customer")}
            >
              <i className="bi bi-person me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage Customer</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            {/** Opening  */}
            <Link
              to={{
                pathname: "/auth/openentry/form",
                search: "?type=customer&trancode=0RC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry Form")}
              >
                <i className="bi bi-journal-arrow-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/openentry/view",
                search: "?type=customer&trancode=0RC&opening=1",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry View</span>}
            </Link>
            {/** Recive/Dafa  */}
            <Link
              to={{
                pathname: "/auth/openentry/form",
                search: "?type=customer&trancode=RAC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Recive/Dafa Form")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Recive/Dafa Entry</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/openentry/view",
                search: "?type=customer&trancode=RAC&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Recive/Dafa View")}
              >
                <i className="bi bi-list-ul ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Recive/Dafa View</span>}
            </Link>

            {/* <Link
              to={{
                pathname: "/auth/search-dafa/selected-dafa",
                search: "?type=customer&trancode=RAC,0RC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Selected Form")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Selected Dafa</span>}
            </Link> */}
            {/** Adjust/Dafa  */}
            <Link
              to={{
                pathname: "/auth/adjust/entry-point",
                search: "?type=customer&trancode=IAC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Dafa Entry")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa </span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/adjust/view",
                search: "?type=customer&trancode=IAC&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Dafa View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa View</span>}
            </Link>

            {/**  Search Dafa  */}
            <Link
              to={{
                pathname: "/auth/search-dafa",
                search: "?type=customer&trancode=RAC,0RC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/search-dafa/view",
                search: "?type=customer&trancode=RAC,0RC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa View")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa View</span>}
            </Link>
            {/**  Payment without item */}
            <Link
              to={{
                pathname: "/auth/pay-wholesaler",
                search: "?type=customer&trancode=PMC&opening=3",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Payment Receive from Mahajon")}
              >
                <i className="bi bi-credit-card pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Pmt. to Customer</span>}
            </Link>
            {/**  Due  */}
            <Link
              to={{
                pathname: "/auth/duercv-wholesaler",
                search: "?type=customer&trancode=RMC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Outstanding Cust.")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Outstanding Cust.</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/duercv-view",
                search: "?type=customer&trancode=RMC",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Outstanding Cust. View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Outstanding Cust. View</span>}
            </Link>
            {/**  Metal return  */}
            <Link
              // to={}
              to={{
                pathname: "/auth/metal-return",
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Return Metal")}
              >
                <i className="bi bi-arrow-repeat ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Return Metal</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/metal-return-view",
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Return Metal View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Return Metal View</span>}
            </Link>
            {/**  ledger  */}
            <Link
              to={{
                pathname: "/auth/ledger-view",
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Ledger View ")}
              >
                <i className="bi bi-cash-coin ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Ledger View</span>}
            </Link>
          </div>
        </details>
        {/** Manage Wholesaler */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage WholeSaler")}
            >
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage WholeSaler</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              // to={"/auth/openentry/form"}
              to={{
                pathname: "/auth/openentry/form",
                search: "?type=wholeseller&trancode=0RW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry Form")}
              >
                <i className="bi bi-journal-arrow-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry</span>}
            </Link>
            <Link
              // to={"/auth/openentry/view"}
              to={{
                pathname: "/auth/openentry/view",
                search: "?type=wholeseller&trancode=0RW&opening=1",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry View</span>}
            </Link>

            {/* for recive dafa entry for wholeseller */}
            <Link
              to={{
                pathname: "/auth/openentry/form",
                search: "?type=wholeseller&trancode=RAW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Recive/Dafa Form")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Recive/Dafa Entry</span>}
            </Link>
            {/* for recive dafa entry for wholeseller */}
            <Link
              // to={"/auth/openentry/view"}
              to={{
                pathname: "/auth/openentry/view",
                search: "?type=wholeseller&trancode=RAW&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              {" "}
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Recive/Dafa View")}
              >
                <i className="bi bi-list-ul ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Recive/Dafa View</span>}
            </Link>
            <Link
              // to={"/auth/openentry/form"}
              to={{
                pathname: "/auth/pay-wholesaler",
                search: "?type=wholeseller&trancode=PMW&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("WholeSaler Pmt.")}
              >
                <i className="bi bi-credit-card pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">WholeSaler Pmt.</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/adjust/entry-point",
                search: "?type=wholeseller&trancode=IAW&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Receive/Dafa")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa </span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/adjust/view",
                search: "?type=wholeseller&trancode=IAW&opening=2",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Dafa View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa View</span>}
            </Link>

            {/**  Search Dafa  */}
            <Link
              to={{
                pathname: "/auth/search-dafa",
                search: "?type=wholesaler&trancode=RAW,0RW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/search-dafa/view",
                search: "?type=wholesaler&trancode=RAW,0RW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa View")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/metal-return",
                search: "?type=wholeseller&trancode=IMW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Return Metal")}
              >
                <i className="bi bi-arrow-repeat ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Return Metal</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/metal-return-view",
                search: "?type=wholeseller&trancode=IMW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Return Metal View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Return Metal View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/duercv-wholesaler",
                search: "?type=wholeseller&trancode=DPW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Outstanding Wh.")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Outstanding Wh.</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/duercv-view",
                search: "?type=wholeseller&trancode=DPW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Outstanding Wh. View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Outstanding Wh. View</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/ledger-view",
                search: "?type=wholeseller&trancode=IAW",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Ledger View")}
              >
                <i className="bi bi-cash-coin ps-3 pe-1"></i>
                {/* <i className="bi bi-arrow-repeat ps-3 pe-1"></i> */}
              </OverlayTrigger>
              {Open && <span className="ml-2">Ledger View</span>}
            </Link>
          </div>
        </details>
        {/** Manage Mahajon */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manage Mahajon")}
            >
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage Mahajon</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              // to={"/auth/openentry/form"}
              to={{
                pathname: "/auth/mahajon/form",
                search: "?type=mahajon&trancode=0RM&opening=3",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry Form")}
              >
                <i className="bi bi-journal-arrow-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry</span>}
            </Link>
            <Link
              // to={"/auth/openentry/view"}
              to={{
                pathname: "/auth/mahajon/view",
                search: "?type=mahajon&trancode=0RM&opening=3",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry View</span>}
            </Link>

            {/* for recive dafa entry for wholeseller */}
            <Link
              to={{
                pathname: "/auth/mahajon/form",
                search: "?type=mahajon&trancode=RAM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Dafa Form")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Dafa Entry</span>}
            </Link>
            {/* for recive dafa entry for wholeseller */}
            <Link
              // to={"/auth/openentry/view"}
              to={{
                pathname: "/auth/mahajon/view",
                search: "?type=mahajon&trancode=RAM&opening=3",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Dafa View")}
              >
                <i className="bi bi-list-ul ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Dafa View</span>}
            </Link>
            <Link
              // to={"/auth/openentry/form"}
              to={{
                pathname: "/auth/pay-wholesaler",
                search: "?type=mahajon&trancode=PMM&opening=3",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Payment Receive from Mahajon")}
              >
                <i className="bi bi-credit-card pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Rcv. from Mahajon</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/adjust/entry-point",
                search: "?type=mahajon&trancode=IAM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Dafa")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/adjust/view",
                search: "?type=mahajon&trancode=IAM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Adjust Dafa View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa View</span>}
            </Link>

            {/**  Search Dafa  */}
            <Link
              to={{
                pathname: "/auth/search-dafa",
                search: "?type=mahajon&trancode=RAM,0RM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/search-dafa/view",
                search: "?type=mahajon&trancode=RAM,0RM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("search/Dafa View")}
              >
                <i className="bi bi-box-arrow-in-down pe-2 ps-3"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Search Dafa View</span>}
            </Link>

            <Link
              // to={}
              to={{
                pathname: "/auth/metal-return",
                search: "?type=mahajon&trancode=IMM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Metal Back")}
              >
                <i className="bi bi-arrow-repeat ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Metal Back </span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/metal-return-view",
                search: "?type=mahajon&trancode=IMM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Metal Back View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Metal Back View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/duercv-wholesaler",
                search: "?type=mahajon&trancode=DPM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("OutStanding Mh.")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">OutStanding Mh.</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/duercv-view",
                search: "?type=mahajon&trancode=DPM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("OutStanding Mh. View")}
              >
                <i className="bi bi-list-check ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">OutStanding Mh. View</span>}
            </Link>
            <Link
              to={{
                pathname: "/auth/ledger-view",
                search: "?type=mahajon&trancode=IAM",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Ledger View")}
              >
                <i className="bi bi-cash-coin ps-3 pe-1"></i>
                {/* <i className="bi bi-arrow-repeat ps-3 pe-1"></i> */}
              </OverlayTrigger>
              {Open && <span className="ml-2">Ledger View</span>}
            </Link>
          </div>
        </details>
        {/** Manage Master */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Manager Master")}
            >
              <i
                className="bi bi-person-gear me-2"
                style={{ fontSize: "22px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Manager Master</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/manager/company"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Company")}
              >
                <i className="bi bi-building ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Company</span>}
            </Link>
            <Link
              to={"/auth/manager/customer"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Customer")}
              >
                <i className="bi bi-person ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Customer</span>}
            </Link>
            <Link
              to={"/auth/manager/wholeseller"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage WholeSaler")}
              >
                <i className="bi bi-people ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">WholeSaler</span>}
            </Link>
            <Link
              to={"/auth/manager/mahajon"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Mahajon")}
              >
                <i className="bi bi-people ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Mahajon</span>}
            </Link>
            <Link
              to={"/auth/manager/groupcost"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Group Cost Center")}
              >
                <i className="bi bi-columns-gap ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Group Cost Center</span>}
            </Link>
            <Link
              to={"/auth/manager/costcenter"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage CostCenter")}
              >
                <i className="bi bi-columns ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Cost Center</span>}
            </Link>
            <Link
              to={"/auth/manager/groupwarehouse"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Group Warehouse")}
              >
                <i className="bi bi-houses ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Group Warehouse</span>}
            </Link>
            <Link
              to={"/auth/manager/warehouse"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage WareHouse")}
              >
                <i className="bi bi-house ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Warehouse</span>}
            </Link>
            <Link
              to={"/auth/manager/goldrate"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Gold Rate")}
              >
                <i className="bi bi-coin ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Gold Rate</span>}
            </Link>
            <Link
              to={"/auth/manager/user"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage User")}
              >
                <i className="bi bi-person-circle ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">User</span>}
            </Link>
            <Link
              to={"/auth/manager/fine"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Fine")}
              >
                <i className="bi bi-scissors ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Fine</span>}
            </Link>
          </div>
        </details>
        {/** Manage Admin settings */}
        <details className="py-1 border-bottom border-light">
          <summary
            className="border-bottom border-secondary py-1"
            style={{
              color: "white",
              padding: "0 0 0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Admin SetUp")}
            >
              <i
                className="bi bi-shield-lock me-2"
                style={{ fontSize: "20px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Admin SetUp</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/admin/calculator"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Calculator")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Calculator</span>}
            </Link>
            <Link
              to={"/auth/admin/timing"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("TimingTable")}
              >
                <i className="bi bi-calendar2-week ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Timing</span>}
            </Link>
            <Link
              to={"/auth/admin/credit-setup"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("TimingTable")}
              >
                <i className="bi bi-credit-card-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Setup Master</span>}
            </Link>
          </div>
        </details>
      </div>
    </div>
  );
}

export default SideBar;
