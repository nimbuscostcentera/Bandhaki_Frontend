import React,{useState,useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./Footer.css";
import "../../GlobalStyle/GlobalTheme.css";
import useControlSidebar from "../../store/useControlSidebar";
function Footer() {
    const { Open } = useControlSidebar();
    useEffect(() => {
      const foot = document.getElementById("foot");
      if (!Open) {
        foot.classList.add("close");
      } else {
        foot.classList.remove("close");
      }
    }, [Open]);
  return (
    <div
      className="footer"
      id="foot"
    >
      Copyright &nbsp;
      <a href="#"> Nimbus Systems Pvt. Ltd. </a>
      &nbsp; 2024
    </div>
  );
}

export default Footer;
