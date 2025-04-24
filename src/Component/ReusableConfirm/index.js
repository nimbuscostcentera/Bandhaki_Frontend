import React from "react";
import { Modal, Button } from "react-bootstrap";

const ReusableConfirm = ({
  show,
  onConfirm,
  onCancel,
  title,
  question,
  btnTitle,
}) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      style={{ zIndex: 9999 }}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm {title}</Modal.Title>
      </Modal.Header>

      {/* <Modal.Body>Are you sure you want to delete this item?</Modal.Body> */}
      <Modal.Body>{question}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {btnTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReusableConfirm;
