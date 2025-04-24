import React from "react";
import { Modal, Button } from "react-bootstrap";

function ReusableModal({
  show,
  handleClose,
  body,
  Title,
  isSuccess,
  isPrimary,
  handleSuccess,
  handlePrimary,
  PrimaryButtonName,
  SuccessButtonName,
}) {
  return (
    <Modal
      size="xl"
      aria-labelledby="example-modal-sizes-title-lg"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            fontSize: "20px",
            fontWeight:600,
            fontFamily: "sans-serif",
            color: "#5c5c5c",
          }}
        >
          {Title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={handleSuccess}
          style={{ visibility: isSuccess ? "visible" : "hidden" }}
        >
          {SuccessButtonName ? SuccessButtonName : "Close"}
        </Button>
        <Button
          variant="primary"
          onClick={handlePrimary}
          style={{ visibility: isPrimary ? "visible" : "hidden" }}
        >
          {PrimaryButtonName ? PrimaryButtonName : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReusableModal;
