import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import useFetchAdminSetUp from "../../store/ShowStore/useFetchAdminSetUp";
import useEditTiming from "../../store/UpdateStore/useEditTiming";
import { toast } from "react-toastify";
import useEditCredit from "../../store/UpdateStore/useEditCredit";
import { ToastContainer } from "react-toastify";
import InputBox from "../../Component/InputBox";
import useInitializedTable from "../../store/DeleteStore/useInitializedTable";
function Initialization() {



  const {
    InitializedTableErr,
    isInitializedTableLoading,
    InitializedTableMsg,
    ClearInitializedTable,
    InitializedTableFnc,
  } = useInitializedTable();


  useEffect(() => {
    if (InitializedTableMsg) {
      toast.success(InitializedTableMsg,{
        position: "top-right",
        autoClose: 2000,
      });
      ClearInitializedTable();
    }
    if (InitializedTableErr) {
      toast.error(InitializedTableErr,{
        position: "top-right",
        autoClose: 2000,
      });
      ClearInitializedTable();
    }
  },[InitializedTableMsg,InitializedTableErr]);

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <h5 className="my-1 mx-1 p-0">Initialization Table</h5>
          <hr />
        </Col>

        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <Button onClick={() => InitializedTableFnc({})}>
            {" "}
            {isInitializedTableLoading ? "Loading..." : "Initialize"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Initialization;
