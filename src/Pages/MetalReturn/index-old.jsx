import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";

import Table from "../../Component/Table";
import ReusableConfirm from "../../Component/ReusableConfirm";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown";
import ReusableModal from "../../Component/ReusableModal";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchAllPaidLots from "../../store/ShowStore/useFetchAllPaidLots";
import useReturnMetalUpdate from "../../store/UpdateStore/useReturnMetalUpdate";
import useFetchSearchFrAdjust from "../../store/ShowStore/useFetchSearchFrAdjust";
import useFetchSelectedSearchList from "../../store/ShowStore/useFetchSelectedSearch";

function Index() {
  const [searchParams] = useSearchParams();
  const entityType =
    searchParams.get("type") == "customer"
      ? 1
      : searchParams.get("type") == "wholeseller"
      ? 2
      : 3;
  // -----------------------------------useState hook---------------------------------
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [FilteredSearchList, setFilteredSearchList] = useState([]);
  const [VoucherTypeList, setVoucherTypeList] = useState([]);
  const [Filter, setFilter] = useState({
    Cust_Type: entityType !== 3 ? entityType : -1,
    HeaderID: -1,
    Adj_Cust_Type: entityType,
    SearchHeaderID:null
  });
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
  const { CompanyID, user } = useFetchAuth();
  const {
    SearchFrAdjustError,
    isSearchFrAdjustLoading,
    isSearchFrAdjustSucc,
    SearchFrAdjustList,
    fetchSearchFrAdjustMaster,
    ClearStateSearchFrAdjust,
  } = useFetchSearchFrAdjust();
  const {
    fetchSelectedSearchList,
    SelectedSearchListError,
    isSelectedSearchListLoading,
    isSelectedSearchListSucc,
    SelectedSearchList,
    ClearStateSelectedSearchList,
  } = useFetchSelectedSearchList();
  const {
    ClearAllPaidLotList,
    fetchAllPaidLotList,
    pageoptions,
    errorAllPaidLots,
    isLoadingAllPaidLots,
    AllPaidLotsList,
    isAllPaidLotSucc,
  } = useFetchAllPaidLots();
  const {
    ClearStateEditOpeningHeader,
    ReturnMetalUpdateFunc,
    ReturnMetalUpdateError,
    isReturnMetalUpdateLoading,
    ReturnMetalUpdateSuccess,
  } = useReturnMetalUpdate();

  //--------------------------functions---------------------------

  const FilterHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (key == "Cust_Type") {
      setFilter((prev) => ({ ...prev, [key]: value, HeaderID: -1 }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };
  const OpenModal = () => {
    setIsModalOpen(true);
  };
  const CloseModal = () => {
    setIsModalOpen(false);
  };
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
        Cust_Type: entityType,
        ...Filter
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

  const ProceedHandler = () => {
    // console.log(filteredData, FilteredSearchList);
    const arr = filteredData.filter((item) => {
      return FilteredSearchList.some(
        (subitem) => subitem.LotNo === item.LotNo && subitem.SRL === item.SRL
      );
    });
    console.log(arr);
    CloseModal();
    setFilteredData(arr);
    setFilter((prev) => ({ ...prev, SearchHeaderID: Filter?.HeaderID }))
  };

  //-------------------------------useEffect--------------------------

  useEffect(() => {
    setFilter({
      Cust_Type: entityType == 3 ? -1 : entityType,
      HeaderID: -1,
      Adj_Cust_Type: entityType,
    });
    setVoucherTypeList([]);
    setSearchTerm("");
    setFilteredData([]);
    setParams({
      ActionID: null,
      IsAction: false,
      view: false,
      Lotno: "",
      srl: "",
      detailview: "",
    });
  }, [entityType]);

  useEffect(() => {
    let list = [];
    if (isSearchFrAdjustSucc && Filter?.Cust_Type > 0) {
      console.log(
        isSearchFrAdjustSucc,
        entityType,
        Filter?.Cust_Type,
        SearchFrAdjustList,
        "find"
      );
      SearchFrAdjustList?.forEach((item) => {
        let obj = {};
        obj.value = `${item?.ID}`;
        obj.label = `${item?.CustomerName}:${item?.EntryDate}`;
        list.push(obj);
      });
      setVoucherTypeList(list);
    }
    ClearStateSearchFrAdjust();
  }, [Filter?.Cust_Type, isSearchFrAdjustSucc, entityType]);

  useEffect(() => {
    if (
      isSelectedSearchListSucc &&
      Filter?.Cust_Type > 0 &&
      Filter?.HeaderID > 0
    ) {
      setFilteredSearchList(SelectedSearchList);
      ClearStateSelectedSearchList();
    } else {
      return;
    }
  }, [
    Filter?.Cust_Type,
    Filter?.HeaderID,
    isSelectedSearchListSucc,
    entityType,
  ]);

  useEffect(() => {
    const timeid = setTimeout(() => {
      if (
        searchTerm !== "" &&
        searchTerm !== null &&
        searchTerm !== undefined
      ) {
        fetchAllPaidLotList({ Cust_Type: entityType, keyword: searchTerm });
      }
    }, [500]);
    return () => clearTimeout(timeid);
  }, [searchTerm, entityType]); //Debouncing

  //AllPaidLotsList
  useEffect(() => {
    if (isAllPaidLotSucc && Array.isArray(AllPaidLotsList)) {
      setFilteredData(AllPaidLotsList);
    }
    ClearAllPaidLotList();
  }, [AllPaidLotsList]);

  useEffect(() => {
    if (ReturnMetalUpdateSuccess) {
      toast.success(ReturnMetalUpdateSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchAllPaidLotList({ Cust_Type: entityType, keyword: searchTerm });
      setSelectedId([]);
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

  useEffect(() => {
    if (Filter?.HeaderID == -1 || Filter?.HeaderID == 0 || !Filter?.HeaderID) {
      return;
    }
    // Search list after filter
    fetchSelectedSearchList({ ...Filter, ...user });
  }, [Filter?.HeaderID]);
  //call search data for adjust
  useEffect(() => {
    console.log(user);
    if (
      Filter?.Cust_Type == -1 ||
      !Filter?.Cust_Type ||
      Filter?.Cust_Type == 0
    ) {
      return;
    }
    fetchSearchFrAdjustMaster({
      Cust_Type: Filter?.Cust_Type,
      CompanyID,
      ...user,
    });
  }, [Filter?.Cust_Type]);

  //-------------------------------other variables---------------------
  const col = [
    // { headername: "ID", fieldname: "ID", type: "number" },
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
  const SearchListCol = [
    { headername: "LotNo", fieldname: "LotNo", type: "text" },
    { headername: "Srl", fieldname: "SRL", type: "number" },
    { headername: "ItemDate", fieldname: "ItemDate", type: "number" },
    { headername: "Mahajon", fieldname: "MahajanName", type: "text" },
  ];

  const CustTypeList = [
    { Value: -1, Name: "--Select Cust type--" },
    { Value: 1, Name: "Customer" },
    { Value: 2, Name: "WholeSaler" },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer autoClose={3000} />
      <Row className="pt-2">
        <Col xl={3} lg={6} md={6} sm={6} xs={12}>
          <h5 className="mt-2">
            All Paid Lot Items
            {entityType == 1
              ? " of Customer"
              : entityType == 2
              ? " of Wholesaler"
              : " to Mahajon"}
          </h5>
        </Col>
        <Col xl={3} lg={6} md={6} sm={6} xs={12}>
          <div className="d-flex justify-content-start align-items-center">
            <InputGroup className="mt-2">
              <Form.Control
                autoFocus
                placeholder="Search here..."
                aria-label="search"
                aria-describedby="basic-addon1"
                style={{ width: "200px", zIndex: "1", padding: "3px 5px" }}
                value={searchTerm}
                onChange={handleChange}
              />
              <InputGroup.Text id="basic-addon1">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Col>
        {entityType == 3 ? (
          <Col xl={2} lg={6} md={6} sm={6} xs={12} className="pt-1">
            <SelectOption
              OnSelect={FilterHandler}
              PlaceHolder={"--Select Customer Type--"}
              SName={"Cust_Type"}
              SelectStyle={{
                padding: "5px 8px",
              }}
              Value={Filter?.Cust_Type}
              sdisabled={false}
              Soptions={CustTypeList}
              key={entityType}
            />
          </Col>
        ) : null}
        <Col xl={2} lg={6} md={6} sm={6} xs={12} className="pt-1">
          <SearchableDropDown
            defaultval={""}
            handleChange={FilterHandler}
            label={"HeaderID"}
            options={VoucherTypeList}
            placeholder={"--Select  Voucher --"}
            selectedVal={Filter?.HeaderID}
            width={"100%"}
            directSearch={false}
            key={entityType}
          />
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <Button variant="link" className="p-0 m-0" onClick={OpenModal} disabled={Filter?.HeaderID>0 ? false : true}>
            <i className="bi bi-funnel fs-4"></i>
          </Button>
          <ReusableModal
            show={isModalOpen}
            handleClose={CloseModal}
            body={
              <Table
                tab={FilteredSearchList}
                Col={SearchListCol}
                key={entityType}
              />
            }
            Title={"Serached Data"}
            isPrimary={true}
            handlePrimary={ProceedHandler}
            PrimaryButtonName={"Proceed"}
            isFullScreen={true}
          />
        </Col>

        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <hr className="my-1" />
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <textarea
            placeholder="Click a Cell to View"
            value={params?.detailview}
            readOnly
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
          <div className="table-box">
            <Table
              height={"55vh"}
              Col={col}
              tab={filteredData}
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
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12} className="mt-2">
          <hr className="my-1" />
          <h6>{entityType == 3 ? "Back" : `Return`} Metal </h6>
          <hr className="my-1" />
        </Col>
        <Col xl={8} lg={8} md={6} sm={6} xs={12} style={{ marginTop: "10px" }}>
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
            {entityType == 3 ? "Back" : `Return`}
          </Button>
        </Col>

        <ReusableConfirm
          show={showConfirmModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          title={entityType == 3 ? "Metal Back" : `Return Metal`}
          btnTitle={entityType == 3 ? "Back" : `Return`}
          question={"Are you sure you want to retun this metal?"}
        />
      </Row>
      {/* Modal */}
    </Container>
  );
}

export default Index;
