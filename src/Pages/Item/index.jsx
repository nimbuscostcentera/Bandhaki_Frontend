import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Button } from "react-bootstrap";

import ItemTable from "./ItemTable";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddItem from "../../store/AddStore/useAddItem";

function ItemListEdit() {
   const inputRef = useRef();

   useEffect(() => {
     if (inputRef.current) {
       inputRef.current.focus();
     }
   }, []);
  const [itemData, setItemData] = useState({
    DESCRIPTION: null,
    ITEMCODE: null,
  });
  const [isDisable, setIsDisable] = useState(false);

  const { CompanyID } = useFetchAuth();
  const {
    ItemRegError,
    isItemRegLoading,
    ItemRegSuccess,
    InsertItem,
    ClearStateItemAdd,
  } = useAddItem();

  const OnChangeHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setItemData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveData = () => {
    // Check if any field is empty or null
    if (!itemData.ITEMCODE || !itemData.DESCRIPTION) {
      toast.error("All fields are required! ", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Proceed to save data if validation passes
    InsertItem({ ...itemData, CompanyID: CompanyID });
  };
  useEffect(() => {
    if (isItemRegLoading && !ItemRegError && !ItemRegSuccess) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (ItemRegSuccess && !isItemRegLoading && !ItemRegError) {
      toast.success("Item Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (ItemRegError && !isItemRegLoading && !ItemRegSuccess) {
      toast.error(ItemRegError, { position: "top-right", autoClose: 3000 });
    }
    setItemData({ DESCRIPTION: null, ITEMCODE: null });
    ClearStateItemAdd();
  }, [isItemRegLoading, ItemRegSuccess, ItemRegError]);

  return (
    <Container fluid style={{ width: "100%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "98%" }}>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div className="d-flex justify-content-between">
            <div>
              {" "}
              <h5>Item Add</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                overflow: "auto",
              }}
            >
              <thead className="tab-head">
                <tr>
                  <th
                    style={{
                      padding: "3px 10px",
                      borderBottom: "1px solid lightgrey",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>Item Code*</th>
                  <th>Item Description*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      placeholder="Item Code"
                      className="input-cell form-input"
                      name="ITEMCODE"
                      value={itemData?.ITEMCODE || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                      ref={inputRef}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Description"
                      className="input-cell"
                      name="DESCRIPTION"
                      value={itemData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                      style={{ width: "100%" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="d-flex justify-content-start align-items-center mt-2">
            <Button
              variant="success"
              onClick={() => SaveData()}
              disabled={isDisable}
            >
              Add
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between">
            <h5>Item Edit</h5>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <ItemTable isDisable={isDisable} setIsDisable={setIsDisable} />
        </Col>
      </Row>
    </Container>
  );
}

export default ItemListEdit;
