"use client";

import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Modal, InputGroup, Form, ListGroup } from "react-bootstrap";

const SearchableDropDown = ({
  options,
  handleChange,
  selectedVal,
  label,
  placeholder,
  defaultval,
  width,
  directSearch = false, // New prop to control search behavior
}) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Find the selected value label
  const findSelectedValue = () => {
    if (Array.isArray(options) && options.length !== 0) {
      const vl = options?.filter((item) => item?.value == selectedVal);
      return vl[0]?.label || "";
    }
    return "";
  };

  // Handle input change for direct search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredOptions([]);
      setShowDropdown(false);
      return;
    }

    // Filter options based on search term
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setShowDropdown(true);
  };

  // Handle option selection from dropdown
  const handleOptionSelect = (option) => {
    const obj = { target: { value: option.value, name: label } };
    handleChange(obj);
    setSearchTerm(option.label);
    setShowDropdown(false);
  };

  // Handle key press events
  const handleKeyDown = (e) => {
    // Handle Tab key
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      setShowDropdown(false); // Close the dropdown
      handleShow(); // Open the modal with Select component
    }

    // Handle Enter key
    if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    }

    // Handle Escape key
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search term when selected value changes
  useEffect(() => {
    setSearchTerm(findSelectedValue());
  }, [selectedVal, options]);

  // Focus the Select component when modal opens
  useEffect(() => {
    if (show && selectRef.current) {
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);
    }
  }, [show]);

  return (
    <div style={{ width: width || "auto", position: "relative" }}>
      <InputGroup style={{ width:width|| "100%" }}>
        <Form.Control
          ref={inputRef}
          placeholder={placeholder}
          value={directSearch ? searchTerm : findSelectedValue()}
          onChange={directSearch ? handleInputChange : undefined}
          onKeyUp={handleKeyDown}
          onClick={directSearch ? undefined : handleShow}
          aria-describedby="basic-addon2"
          style={{
            padding: "4px 5px",
            borderRadius: "3px",
            fontSize: "13px",
            color: "rgba(75, 75, 75, 0.62)",
          }}
        />
        <InputGroup.Text
          id="basic-addon2"
          onClick={handleShow}
          style={{
            padding: "4px 5px",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
      {/* Modal for traditional search */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {placeholder}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            ref={selectRef}
            defaultValue={defaultval}
            value={options.find((opt) => opt.value === selectedVal) || null}
            isClearable={true}
            options={options}
            isSearchable={true}
            onChange={(e) => {
              const obj = { target: { value: null, name: null } };
              obj.target.value = e ? e.value : null;
              obj.target.name = label;
              handleChange(obj);
              handleClose();
            }}
            placeholder={`--${placeholder}--`}
            label={label}
            menuIsOpen={true}
            autoFocus
            openMenuOnFocus
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: "none",
                borderColor: "#ced4da",
                "&:hover": {
                  borderColor: "#adb5bd",
                },
              }),
              menu: (base) => ({
                ...base,
                marginTop: 0,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                zIndex: 4,
              }),
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SearchableDropDown;
