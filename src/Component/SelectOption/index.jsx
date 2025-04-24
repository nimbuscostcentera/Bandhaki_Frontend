import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./SelectOption.css";

function SelectOption({
  Soptions = [],
  OnSelect,
  SName,
  PlaceHolder,
  Value,
  SelectStyle,
  sdisabled,
}) {
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      name={SName}
      onChange={OnSelect}
      value={Value || 0} // Ensure Value is controlled
      style={SelectStyle}
      disabled={sdisabled}
    >
      {Soptions?.map((item, index) => (
        <option value={item?.Value} key={index} className="option-fontSize">
          {item?.Name}
        </option>
      ))}
    </select>
  );
}

export default SelectOption;
