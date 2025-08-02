import React, { useEffect, useRef, useState,  } from "react";
import { useSearchParams } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
import EntryHeaderMahajon from "./EntryHeaderMahajon";
import EntryDetailMahajon from "./EntryDetailMahajon";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddFundFrmMahajon from "../../store/AddStore/useAddFundFrmMahajon";
import useFetchLotsForMahajon from "../../store/ShowStore/useFetchLotsForMahajon";
function OpeningEntryMahajon() {
  const { CompanyID, user } = useFetchAuth();
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  const [searchParams] = useSearchParams();
  const trancode = searchParams.get("trancode");
  const entityType = searchParams.get("type") == "mahajon" ? 3 : 0;
  const rendering = searchParams.get("opening");
  const srlInputRef = useRef(null);
  const DateInputRef = useRef(null);
  const [headerData, setHeaderData] = useState({
    LotNo: null,
    Date: user?.date,
    MahajonID: null,
    LotsNo: [],
  });
  const [ItemDetails, SetItemDetails] = useState([]);
  const [IsModalOpen, setIsModalOpen] = useState(false);
    const [selectedLots, setSelectedLots] = useState([]);
  //-----------------------------------------API------------------------------------------//
  const {
    ClearStateAddFundFrmMahajon,
    AddFundFrmMahajon,
    isAddFundFrmMahajonLoading,
    AddFundFrmMahajonSuccess,
    AddFundFrmMahajonError,
    isAddFundFrmMahajonSuccess,
    isAddFundFrmMahajonError,
  } = useAddFundFrmMahajon();

  const {
    LotsForMahajon,
    fetchLotsForMahajon,
    CLearLotsForMahajon,
    isErrorLotsForMahajon,
    isSuccesLotsForMahajon,
    isLoadingLotsForMahajon,
  } = useFetchLotsForMahajon();
  //---------------------------------------------FUNCTION----------------------------------------//
  const HandleSubmit = () => {
    const finalobj = {
      ...headerData,
      Cust_Type: entityType,
      TranCode: trancode,
      CompanyID,
      details: Array.isArray(ItemDetails) ? [...ItemDetails] : [],
    };

    // Basic validations
    if (!finalobj?.Date) {
      return toast.error("Date is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (!finalobj?.Cust_Type) {
      return toast.error("Customer Type is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (!finalobj?.TranCode) {
      return toast.error("Transaction Code is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (finalobj?.details?.length === 0) {
      return toast.error("At least one item detail is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (!finalobj?.LotNo) {
      return toast.error("Lot Number is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (!finalobj?.MahajonID) {
      return toast.error("Mahajon ID is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Check that each detail has non-empty principalDetails array
    const validDetails = finalobj?.details?.every(
      (item) =>
        Array.isArray(item?.principalDetails) && item?.principalDetails?.length > 0
    );
    if (!validDetails) {
      return toast.error(
        "Each detail must have at least one principal detail",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }

    // All checks passed — submit the object
    AddFundFrmMahajon(finalobj);
    // console.log("Submitting", finalobj);
  };
  

  const handleHeaderChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    // Special handling for LotNo vs LotsNo
    if (key === "LotNo") {
      setHeaderData((prev) => ({
        ...prev,
        LotNo: value, // Single value for API calls
        [key]: value,
      }));
    } else {
      setHeaderData((prev) => ({ ...prev, [key]: value }));
    }
  };
  const HandleCloseModal = () => {
    setIsModalOpen(false);
  };
  const HandleSaveDate = (b) => {
    console.log(b);
    
    setHeaderData((prev) => ({ ...prev, Date: b }));
  };
  const HandleModalOpn = () => {
    setIsModalOpen(true);
  };

  //------------------------------------useEffect------------------------------------//
  useEffect(() => {
    if (AddFundFrmMahajonSuccess) {
      toast.success(AddFundFrmMahajonSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      setRefreshKey((prev) => prev + 1); // Add this line to trigger refresh
      setHeaderData({
        LotNo: null,
        Date: user?.date,
        MahajonID: null,
        LotsNo: [],
      });
      SetItemDetails([]);
      setSelectedLots([]);
    }
    if (isAddFundFrmMahajonError) {
      toast.error(AddFundFrmMahajonError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  ClearStateAddFundFrmMahajon();
  }, [isAddFundFrmMahajonSuccess, isAddFundFrmMahajonError]);

  useEffect(() => {
    SetItemDetails([]);
  }, [headerData.LotNo]);


  return (
    <Container fluid>
      <ToastContainer />
      <Row style={{ paddingTop: "50px" }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} pt={5}>
          <div className="d-flex justify-content-between">
            <h5>
              {trancode == "0RM" ? "Opening Entry " : "Dafa "}
              Entries of Mahajan
            </h5>
          </div>
          <hr className="my-1" />
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12} pt={5}>
          <EntryHeaderMahajon
            ItemDetails={ItemDetails}
            trancode={trancode}
            entityType={entityType}
            handleHeaderChange={handleHeaderChange}
            refreshKey={refreshKey} // Pass it as prop
            headerData={headerData}
            handleShow={HandleModalOpn}
            dateInputRef={DateInputRef}
            toast={toast}
            view={IsModalOpen}
            handleClose1={HandleCloseModal}
            handleSave1={(b, e) => HandleSaveDate(b)}
            selectedLots={selectedLots}
            setSelectedLots={setSelectedLots}
          />
        </Col>

        <Col>
          <hr className="my-1" />
          <h6>Items</h6>
          <hr className="my-1" />
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <EntryDetailMahajon
            entrydate={headerData?.Date}
            LotNo={headerData?.LotNo}
            SetItemDetails={SetItemDetails}
            successreturn={isAddFundFrmMahajonSuccess}
            headerData={headerData}
            selectedLots={selectedLots}
            setSelectedLots={setSelectedLots}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="d-flex justify-content-end mt-1">
            <button
              className="btn btn-success"
              style={{ padding: "1px 5px" }}
              onClick={HandleSubmit}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default OpeningEntryMahajon;
