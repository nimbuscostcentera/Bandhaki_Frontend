import React, { forwardRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./InputBox.css";
import { Button } from "react-bootstrap";

const InputBox = forwardRef(
  (
    {
      Icon,
      type,
      placeholder,
      label,
      Name,
      onChange,
      error,
      errorMsg,
      maxlen,
      value,
      InputStyle,
      SearchIcon,
      SearchButton,
      SearchHandler,
      isdisable,
      isfrontIconOff,
      onFocusChange,
      marginYClass = "",
    },
    ref // 👈 Accept ref as a parameter
  ) => {
    return (
      <div className={`Zindex ${marginYClass}`}>
        <div className="input-group flex-nowrap">
          {!isfrontIconOff && (
            <span
              className="input-group-text color-label Zindex"
              id="addon-wrapping"
            >
              {Icon}
            </span>
          )}

          <input
            ref={ref} // 👈 Attach ref to input field
            value={value || ""}
            type={type}
            className="form-input Zindex"
            placeholder={placeholder}
            aria-label={label}
            onChange={onChange}
            name={Name}
            maxLength={maxlen}
            style={InputStyle}
            disabled={isdisable}
            onBlur={onFocusChange}
          />
          {SearchButton && (
            <Button className="search" onClick={SearchHandler}>
              {SearchIcon || <i className="bi bi-search"></i>}
            </Button>
          )}
        </div>
        <div
          style={{
            display: error ? "inherit" : "none",
            color: "red",
            fontSize: "10px",
          }}
        >
          {errorMsg}
        </div>
      </div>
    );
  }
);

export default InputBox;
