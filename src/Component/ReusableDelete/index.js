import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ show, onConfirm, onCancel }) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      style={{ zIndex: 9999 }}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>Are you sure you want to delete this item?</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
