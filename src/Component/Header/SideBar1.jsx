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
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage Customer</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              // to={"/auth/openentry/form"}
              to={{
                pathname: "/auth/openentry/form",
                search: "?type=customer",
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
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View Report")}
              >
                <i className="bi bi-file-spreadsheet ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/adjust/entry-point",
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry Adjust View")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Receive/Dafa </span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/auth/adjust/view",
                search: "?type=customer",
              }}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View Report")}
              >
                <i className="bi bi-file-spreadsheet ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/",
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
          </div>
        </details>

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
              <i className="bi bi-people me-2" style={{ fontSize: "22px" }}></i>
            </OverlayTrigger>
            {Open && <span>Manage WholeSeller</span>}
          </summary>
          <div style={{ backgroundColor: "#212121" }}>
            <Link
              to={"/auth/openentry/form"}
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
              to={"/auth/openentry/view"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View Report")}
              >
                <i className="bi bi-file-spreadsheet ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Opening Entry View</span>}
            </Link>
            <Link
              to={"/auth/adjust/entry-point"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry Adjust View")}
              >
                <i className="bi bi-calculator ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Receive/Dafa </span>}
            </Link>
            <Link
              to={"/auth/adjust/view"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Opening Entry View Report")}
              >
                <i className="bi bi-file-spreadsheet ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Adjust Dafa View</span>}
            </Link>
            <Link
              // to={}
              to={{
                pathname: "/",
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
          </div>
        </details>
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
              overlay={renderTooltip("Master Manager")}
            >
              <i
                className="bi bi-person-gear me-2"
                style={{ fontSize: "22px" }}
              ></i>
            </OverlayTrigger>
            {Open && <span>Master Manager</span>}
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Customer</span>}
            </Link>
            <Link
              to={"/auth/manager/wholeseller"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage WholeSeller")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">WholeSeller</span>}
            </Link>
            <Link
              to={"/auth/manager/groupcost"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Group CC.")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Cost Center</span>}
            </Link>
            <Link
              to={"/auth/manager/groupwarehouse"}
              className="border-bottom border-secondary"
            >
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Manage Group WH.")}
              >
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
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
                <i className="bi bi-gear-fill ps-3 pe-1"></i>
              </OverlayTrigger>
              {Open && <span className="ml-2">Fine</span>}
            </Link>
          </div>
        </details>
      </div>
    </div>
  );
}

export default SideBar;
