import React from "react";
import { Modal, Button} from "react-bootstrap";

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
  isFullScreen,
  isFooterOff,
  isCustomHeader,
  HeaderComponent
}) {
  return (
    <Modal
      size="xl"
      aria-labelledby="example-modal-sizes-title-lg"
      show={show}
      onHide={handleClose}
      fullscreen={isFullScreen || false}
    >
      {isCustomHeader ? null : (
        <Modal.Header closeButton>
          <h5
            style={{
              fontSize: "normal",
              fontWeight: 600,
              fontFamily: "sans-serif",
              color: "#5c5c5c",
              padding: 0,
              margin:0
            }}
          >
            {Title}
          </h5>
        </Modal.Header>
      )}

      <Modal.Body style={{ padding: "1px 15px" }}>{body}</Modal.Body>
      {isFooterOff ? null : (
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
      )}
    </Modal>
  );
}

export default ReusableModal;
