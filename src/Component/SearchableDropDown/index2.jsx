import React, { useState } from "react";
import Select from "react-select";
import { Modal, InputGroup, Form, Button } from "react-bootstrap";
const SearchableDropDown = ({
  options,
  handleChange,
  selectedVal,
  label,
  placeholder,
  defaultval,
  width,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // //console.log(selectedVal,"checkselect")
  const findSelectedValue = () => {
    if (Array.isArray(options) && options.length != 0) {
      let vl = null;
      vl = options?.filter((item) => item?.value == selectedVal);
      // //console.log(vl, options, "check options");
      return vl[0]?.label || "";
    }
  };
  return (
    <div style={{ width: width || "auto" }}>
      <InputGroup onClick={handleShow} style={{ width: "100%" }}>
        <Form.Control
          placeholder={placeholder}
          value={findSelectedValue()}
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
          style={{
            padding: "4px 5px",
            borderTopRightRadius: "3px",
            borderBottonRightRadius: "3px",
          }}
        >
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {placeholder}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            defaultValue={defaultval}
            value={selectedVal}
            isClearable={true}
            options={options}
            isSearchable={true}
            onChange={(e) => {
              let obj = { target: { value: null, name: null } };
              obj.target.value = e.value;
              obj.target.name = label;
              handleChange(obj);
              handleClose();
            }}
            placeholder={`--${placeholder}--`}
            label={label}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};
export default SearchableDropDown;
