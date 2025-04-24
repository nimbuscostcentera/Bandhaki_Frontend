import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddPurity from "../../store/AddStore/useAddPurity";
import useFetchSetup from "../../store/ShowStore/useFetchSetup";
import useSetupEdit from "../../store/Auth/useSetupEdit";

// import PurityTable from "./PurityTable";

function Setup() {
  const [setUpData, setSetUpData] = useState({
    id: "",
    CustPrefix: "",
    RegularPrefix: "",
    PartyPrefix: "",
    Days: "",
  });

  const { SetupList, isSetupLoading, SetupError, fetchSetupMaster } =
    useFetchSetup();
  const {
    EditSetupFunc,
    SetupEditError,
    isSetupEditLoading,
    SetupEditSuccess,
    ClearStateEditSetup,
  } = useSetupEdit();

  const OnChangeHandler = (e) => {
    // //console.log(e);
    /*************  ✨ Codeium Command 🌟  *************/

    let key = e.target.name;
    let value = e.target.value;
    setSetUpData((prev) => ({ ...prev, [key]: value }));
  };

  const SaveData = () => {
    EditSetupFunc({ ...setUpData });
  };

  useEffect(() => {
    if (isSetupEditLoading && !SetupEditSuccess && !SetupEditError) {
      toast.play("pleaes wait...", { position: "top-right", autoClose: 3000 });
    } else if (SetupEditSuccess && !isSetupEditLoading && !SetupEditError) {
      toast.success(SetupEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      setSetUpData({
        id: "",
        CustPrefix: "",
        RegularPrefix: "",
        PartyPrefix: "",
        Days: "",
      });
    } else if (SetupEditError && !isSetupEditLoading && !SetupEditSuccess) {
      toast.error(SetupEditError, { position: "top-right", autoClose: 3000 });
    }
    ClearStateEditSetup();
  }, [isSetupEditLoading, SetupEditSuccess, SetupEditError]);

  useEffect(() => {
    fetchSetupMaster(); // Add other fields as required
  }, [SetupEditSuccess]);

  //set regulardata in filterdata
  useEffect(() => {
    if (SetupList?.length > 0) {
      const { id, company, PartyPrefix, RegularPrefix, CustPrefix, Days } =
        SetupList[0];

      setSetUpData((prev) => {
        return {
          ...prev,
          id,
          company,
          PartyPrefix,
          RegularPrefix,
          CustPrefix,
          Days,
        };
      });
    }
  }, [SetupList, SetupEditSuccess]);

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
              <h5>Serial info</h5>
            </div>
          </div>
          <hr style={{ marginTop: "2px" }} />
        </Col>

        <Col
          xs={12}
          sm={12}
          md={6}
          lg={6}
          xl={9}
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
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "3px 10px",
                      borderBottom: "1px solid lightgrey",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                  </th>
                  <th>Customer Prefix</th>
                  <th>Regular Prefix</th>
                  <th>Party Prefix</th>
                  <th>Days</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <i className="bi bi-caret-right-fill"></i>
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Purity Code"
                      className="input-cell"
                      name="CustPrefix"
                      value={setUpData?.CustPrefix || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Purity name"
                      className="input-cell"
                      name="RegularPrefix"
                      value={setUpData?.RegularPrefix || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Purity name"
                      className="input-cell"
                      name="PartyPrefix"
                      value={setUpData?.PartyPrefix || ""}
                      onChange={OnChangeHandler}
                      type="text"
                      maxLength={100}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: "100%" }}
                      placeholder="Purity name"
                      className="input-cell"
                      name="Days"
                      value={setUpData?.Days || ""}
                      onChange={OnChangeHandler}
                      type="number"
                      maxLength={100}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="d-flex justify-content-start align-items-center mt-3">
            <Button variant="success" onClick={() => SaveData()}>
              save
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Setup;
