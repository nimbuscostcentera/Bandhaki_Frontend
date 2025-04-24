import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./ResetButton.css";
import "../../GlobalStyle/GlobalTheme.css";
function ResetButton({ onClick, type, Buttonname }) {
  return (
    <div className="d-flex justify-content-center align-item-center">
      <button
        className="btn color-btn-err btn-width"
        type={type}
        onClick={onClick}
      >
        <span className="btn-font-size">
          {Buttonname ? Buttonname : "Reset"}
        </span>
      </button>
    </div>
  );
}

export default ResetButton;
