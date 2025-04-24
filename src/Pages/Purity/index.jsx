import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddPurity from "../../store/AddStore/useAddPurity";

import PurityTable from "./PurityTable";

function PurityListEdit() {
  const [CustData, setCustData] = useState({ PURITY: null, DESCRIPTION: null });
  const [isDisable, setIsDisable] = useState(false);
  const { CompanyID } = useFetchAuth();
  const {
    InsertPurity,
    AddPuritySuccess,
    isAddPurityLoading,
    AddPurityError,
    ClearStateAddPurity,
  } = useAddPurity();

  const OnChangeHandler = (e) => {
    //console.log(e)
    /*************  ✨ Codeium Command 🌟  *************/
    if (e.target) {
      let key = e.target.name;
      let value = e.target.value;
      setCustData((prev) => ({ ...prev, [key]: value }));
    } else {
      console.error("PurityListEdit: OnChangeHandler: e.target is null");
    }
    let key = e.target.name;
    let value = e.target.value;
    setCustData((prev) => ({ ...prev, [key]: value }));
  };

  const SaveData = (e) => {
    e.preventDefault();
    if (!CustData.PURITY) {
      toast.error("All fields are required! ", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    InsertPurity({ ...CustData, CompanyID: CompanyID });
  };

  useEffect(() => {
    if (isAddPurityLoading && !AddPuritySuccess && !AddPurityError) {
      toast.play("pleaes wait...", { position: "top-right", autoClose: 3000 });
    } else if (AddPuritySuccess && !isAddPurityLoading && !AddPurityError) {
      toast.success("Purity Added Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setCustData({ CityCode: null });
    } else if (AddPurityError && !isAddPurityLoading && !AddPuritySuccess) {
      toast.error(AddPurityError, { position: "top-right", autoClose: 3000 });
    }
    ClearStateAddPurity();
  }, [isAddPurityLoading, AddPuritySuccess, AddPurityError]);

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
              <h5>Purity Add</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>

        <Col
          xs={12}
          sm={5}
          md={4}
          lg={4}
          xl={4}
          style={{ paddingLeft: "15px", margin: "0px" }}
        >
          <div
            style={{
              width: "100%",
              overflow: "auto",
            }}
          >
            <table
          
              style={{
                width: "100%",
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
                  <th>Purity*</th>
                  <th>DESCRIPTION*</th>
                </tr>
              </thead>
              <tbody className="tab-body">
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Purity"
                      className="input-cell"
                      name="PURITY"
                      value={CustData?.PURITY || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Description"
                      className="input-cell"
                      name="DESCRIPTION"
                      value={CustData?.DESCRIPTION || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={7} md={8} lg={8} xl={8}>
          <div className="d-flex justify-content-start align-items-center mt-3">
            <Button
              variant="success"
              onClick={(e) => SaveData(e)}
              disabled={isDisable}
            >
              save
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <h5>Edit Purity</h5>
          <hr className="my-1" />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ paddingLeft: "15px", marginTop: "5px" }}
        >
          <PurityTable isDisable={isDisable} setIsDisable={setIsDisable} />
        </Col>
      </Row>
    </Container>
  );
}

export default PurityListEdit;
