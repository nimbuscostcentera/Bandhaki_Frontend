import React from "react";
import Select from "react-select";

const SearchableDropDown2 = ({
  options,
  handleChange,
  selectedVal,
  label,
  placeholder,
  defaultval,
}) => {
  const findSelectedValue = () => {
    let vl = options?.find((item) => item?.value === selectedVal);
    return vl?.label || "";
  };

  return (
    <div style={{ width: "100%",position: "relative",  }}>
      <Select
        defaultValue={defaultval}
        value={options?.find((item) => item.value === selectedVal)} // Ensures the selected option is displayed correctly
        isClearable={true}
        options={options}
        isSearchable={true}
        onChange={(e) => {
          let obj = { target: { value: null, name: null } };
          obj.target.value = e ? e.value : null; // Handle the cleared selection
          obj.target.name = label;
          handleChange(obj); // Pass the value or null to the parent component
        }}
        placeholder={`--${placeholder}--`}
        label={label}
      />
    </div>
  );
};

export default SearchableDropDown2;