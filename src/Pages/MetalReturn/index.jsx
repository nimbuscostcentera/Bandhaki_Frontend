"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Table from "../../Component/Table";
import useFetchAllPaidLots from "../../store/ShowStore/useFetchAllPaidLots";
import { toast, ToastContainer } from "react-toastify";
import useReturnMetalUpdate from "../../store/UpdateStore/useReturnMetalUpdate";
import ReusableConfirm from "../../Component/ReusableConfirm";
function Index() {
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get("type") === "customer" ? 1 : 2;
  // -----------------------------------useState hook---------------------------------
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    view: false,
    Lotno: "",
    srl: "",
    detailview: "",
  });
  //-------------------------------API Call-------------------------
  const {
    ClearAllPaidLotList,
    fetchAllPaidLotList,
    pageoptions,
    errorAllPaidLots,
    isLoadingAllPaidLots,
    AllPaidLotsList,
  } = useFetchAllPaidLots();
  const {
    ClearStateEditOpeningHeader,
    ReturnMetalUpdateFunc,
    ReturnMetalUpdateError,
    isReturnMetalUpdateLoading,
    ReturnMetalUpdateSuccess,
  } = useReturnMetalUpdate();

  //--------------------------functions---------------------------
  const handleChange = (e) => {
    setSearchTerm((prev) => e.target.value);
  };
  const handleReturn = (e) => {
    setShowConfirmModal(true);
  };
  const confirmDelete = () => {
    // if (itemToDelete) {
    //   DeleteOpeningHeader({ ID: itemToDelete.ID, Cust_Type: entityType });
    // }
    if (selectedId.length > 0) {
      ReturnMetalUpdateFunc({
        LotNo: selectedId[0]?.LotNo,
        Srl: selectedId[0]?.SRL,
      });
      // console.log(selectedId);
    }
    // setShowDeleteModal(false);
    setShowConfirmModal(false);
    // setItemToDelete(null);
  };
  const cancelDelete = () => {
    // setShowDeleteModal(false);
    setShowConfirmModal(false);
    // setItemToDelete(null);
  };
  // const handleViewClick = (e) => {
  //   console.log(AllPaidLotsList[e], "AllPaidLotsList");
  //   let obj = (AllPaidLotsList[e]);
  //   let Lotno = obj?.LotNo;
  //   let SRL = obj?.SRL;
  //    setParams((prev) => ({
  //      ...prev,
  //      Lotno:Lotno,
  //      srl:SRL,
  //    }));
  //   setParams((prev) => ({ ...prev, view: true }));

  // };
  // const handleClose = () => {
  //   setParams((prev) => ({ ...prev, view: false }));
  // };
  // const onCheckChange = (e) => {

  // };
  const handleCheckChange = (item, isChecked) => {
    // console.log(item,"Item");
    setSelectedId((prev) => {
      const isAlreadySelected = prev.some(
        (i) => i?.LotNo === item?.LotNo && i?.SRL === item?.SRL
      );

      // Uncheck if the same item is clicked again
      if (isAlreadySelected && !isChecked) {
        return [];
      }

      // Select the new item (replacing the previous one)
      if (isChecked) {
        return [item];
      }

      return [];
    });
  };
  //-------------------------------useEffect--------------------------
  useEffect(() => {
    const timeid = setTimeout(() => {
      if (searchTerm !== "") {
        fetchAllPaidLotList({ Cust_Type: entityType, keyword: searchTerm });
      } else if (searchTerm === "") {
        fetchAllPaidLotList({ Cust_Type: entityType, keyword: searchTerm });
        setFilteredData([]);
      }
    }, [500]);
    return () => clearTimeout(timeid);
  }, [searchTerm, entityType]); //Debouncing
  //AllPaidLotsList
  useEffect(() => {
    if (Array?.isArray(AllPaidLotsList) && AllPaidLotsList?.length >= 0) {
      setFilteredData(AllPaidLotsList);
    } else {
      setFilteredData([]);
    }
    ClearAllPaidLotList();
  }, [AllPaidLotsList]);
  useEffect(() => {
    if (ReturnMetalUpdateSuccess) {
      toast.success(ReturnMetalUpdateSuccess, {
        position: "top-right",
        autoClose: 3000,
      });

      // setFilteredData([]);
      fetchAllPaidLotList({ Cust_Type: entityType, keyword: searchTerm });
      setSelectedId([]);
      // setSearchTerm("");
    }
    if (ReturnMetalUpdateError) {
      toast.error(ReturnMetalUpdateError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditOpeningHeader();
  }, [
    ReturnMetalUpdateError,
    isReturnMetalUpdateLoading,
    ReturnMetalUpdateSuccess,
  ]);

  //-------------------------------other variables---------------------
  const col = [
    { headername: "LotNo", fieldname: "LotNo", type: "String" },
    { headername: "Srl", fieldname: "SRL", type: "String", width: "60px" },
    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      width: "150px",
    },
    { headername: "Name", fieldname: "Name", type: "String" },
    { headername: "Phone No.", fieldname: "ContactNumber", type: "String" },
    {
      headername: "Tot. Prn. Rcv.",
      fieldname: "Update_Prn_Rcv",
      type: "String",
    },
    {
      headername: "Tot. Prn. Paid",
      fieldname: "Update_Prn_Paid",
      type: "String",
    },
    {
      headername: "Tot. Int. Paid",
      fieldname: "Update_Paid_Int_Amt",
      type: "String",
    },
  ];
  return (
    <Container fluid className="pt-5">
      <ToastContainer autoClose={3000} />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h6 className="mt-2">
                All Paid Lot Items of{" "}
                {entityType == 1 ? "Customer" : "Wholesaler"}
              </h6>
            </div>
            <div>
              <InputGroup className="mt-2">
                <Form.Control
                  autoFocus
                  placeholder="Search here..."
                  aria-label="search"
                  aria-describedby="basic-addon1"
                  style={{ width: "300px", zIndex: "1", padding: "3px 5px" }}
                  value={searchTerm}
                  onChange={handleChange}
                />
                <InputGroup.Text id="basic-addon1">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <hr className="my-1" />
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <textarea
            placeholder="Click a Cell to View"
            value={params?.detailview}
            rows={2}
            style={{
              width: "100%",
              border: "1px solid lightgrey",
              borderRadius: "5px",
              resize: "none",
              outlineWidth: "1px",
              outlineColor: "dodgerblue",
            }}
          />
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div
            className="table-box"
            style={{ height: "40vh", border: "1px solid lightgrey" }}
          >
            <Table
              Col={col}
              tab={AllPaidLotsList || []}
              isCheck={true}
              // isView={true}
              getFocusText={(e) => {
                setParams((prev) => ({ ...prev, detailview: e }));
              }}
              // handleViewClick={(tabindex) => handleViewClick(tabindex)}

              checkedIds={selectedId}
              onCheckChange={handleCheckChange}
            />
          </div>
          {/* <ReusableModal
            show={params?.view}
            Title={"Transaction Detail"}
            handleClose={handleClose}
            PrimaryButtonName={"checked"}
            isPrimary={true}
            handlePrimary={() => {
              return 0;
            }}
            body={
              <RecheckMetalDetail
                entityType={entityType}
                lotno={params?.Lotno}
                srl={params?.srl}
              />
            }
          /> */}
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mt-3">
          <hr className="my-1" />
          <h6>Return Metal </h6>
          <hr className="my-1" />
        </Col>
        <Col xl={8} lg={8} md={6} sm={6} xs={12} style={{ marginTop: "20px" }}>
          <textarea
            placeholder="remark"
            rows={2}
            style={{
              width: "100%",
              border: "1px solid grey",
              borderRadius: "5px",
            }}
          />
        </Col>
        <Col
          xl={2}
          lg={2}
          md={3}
          sm={3}
          xs={6}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="success"
            onClick={handleReturn}
            disabled={selectedId.length == 0}
          >
            Return
          </Button>
        </Col>
        {/* <Col
          xl={2}
          lg={2}
          md={3}
          sm={3}
          xs={6}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button>Recheck</Button>
        </Col> */}
        <ReusableConfirm
          show={showConfirmModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title={"Return Metal"}
          btnTitle={"Return"}
          question={"Are you sure you want to retun this metal?"}
        />
      </Row>
      {/* Modal */}
    </Container>
  );
}

export default Index;
