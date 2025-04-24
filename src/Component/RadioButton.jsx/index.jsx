import React from "react";
import "./RadioButton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "bootstrap-icons/font/bootstrap-icons.css";
function RadioButton({ OptionArray = [], OnClick, RName }) {
  return (
    <div className="container-fluid d-flex justify-content-start align-items-center flex-wrap">
      {OptionArray?.map((item, index) => {
        return (
          <div className="px-2 mt-2 pt-1" key={index}>
            <label
              className="text-secondary small center-alignment"
              htmlFor={`flexRadioDefault${index}`}
            >
              <input
                type="radio"
                name={RName}
                value={item?.value}
                id={`flexRadioDefault${index}`}
                onChange={OnClick}
                className="radio-position"
              />
              &nbsp;
              <span className="text-label">{item?.name}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default RadioButton;
