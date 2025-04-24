import React, { useState } from "react";
import Select from "react-select";
import { Modal, InputGroup, Form, Button } from "react-bootstrap";
const MultipleSelection = ({
  options,
  handleChange,
  selectedVal,
  label,
  placeholder,
  defaultval,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //console.log(selectedVal,"Selected value");
  const findSelectedValue = () => {
    // //console.log(selectedVal)
    // //console.log(options,"optins");
    // options=options.filter((ite))
    let big = options?.map((item) => Number(item?.value));
    // //console.log(big,"Value");
    const selectedIds = selectedVal?.map((item) => Number(item?.value)) || [];
    // //console.log(selectedIds, "selectedIds");

    const filteredData = options.filter(
      (item) => !selectedIds.includes(Number(item?.value))
    );
    // //console.log(filteredData, "filteredData");
    options = filteredData;
    // let filteredData=options.filter(item=>  !big.includes(Number(item?.value)))
    // //console.log(filteredData,"filtereddata")
    let vl =
      selectedVal?.filter((item, index) => {
        return big.includes(Number(item?.value));
      }) || [];
    // //console.log(vl,"v1");
    // let filteredData= vl.filter((item)=>{
    //   return  !big.includes(item?.value)
    // })
    // //console.log(filteredData,"filtered")
    let val = vl.map((element) => element?.label);
    // //console.log(val, big, vl,"findme");
    return val.join(", ");
  };
  return (
    <div style={{ width: "250px" }}>
      <InputGroup onClick={handleShow}>
        <Form.Control
          placeholder={placeholder}
          value={findSelectedValue()}
          type="textarea"
          aria-describedby="basic-addon2"
          style={{
            padding: "4px 5px",
            borderRadius: "3px",
            fontSize: "13px",
            color: "rgba(75, 75, 75, 0.62);",
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
            isMulti
            value={selectedVal}
            isClearable={false}
            options={options}
            isSearchable={true}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder={`--${placeholder}--`}
            label={label}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default MultipleSelection;
