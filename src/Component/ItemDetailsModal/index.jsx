import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

function ItemDetailsModal({ show, onHide, data, onSort }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
            <th>
                Srl
                <Button
                                    variant="link"
                                    style={{ padding: "1px 1px", color: "white" }}
                                    onClick={() => onSort("id", "number")}
                                  >
                                    <i className="bi bi-arrow-down-up"></i>
                                  </Button>
              </th>
              <th>
                Item Code
                <Button
                                    variant="link"
                                    style={{ padding: "1px 1px", color: "white" }}
                                    onClick={() => onSort("itemcode", "String")}
                                  >
                                    <i className="bi bi-arrow-down-up"></i>
                                  </Button>
              </th>
              <th>
                Description
                <Button
                                    variant="link"
                                    style={{ padding: "1px 1px", color: "white" }}
                                    onClick={() => onSort("description", "String")}
                                  >
                                    <i className="bi bi-arrow-down-up"></i>
                                  </Button>
              </th>
              <th>
                Weight
                <Button
                                    variant="link"
                                    style={{ padding: "1px 1px", color: "white" }}
                                    onClick={() => onSort("wt", "number")}
                                  >
                                    <i className="bi bi-arrow-down-up"></i>
                                  </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                     <td>{item.id}</td>
                  <td>{item.itemcode}</td>
                  <td>{item.description}</td>
                  <td>{item.wt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ItemDetailsModal;
