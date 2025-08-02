import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { Row, Col, Container } from "react-bootstrap";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";

import Table from "../../Component/Table";
import SearchDetails from "./SearchDetails";
import ReusableModal from "../../Component/ReusableModal";
import BongDatePicker from "../../Component/BongDatePicker";
import DeleteConfirmation from "../../Component/ReusableDelete";
import SearchableDropDown from "../../Component/SearchableDropDown";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchCust from "../../store/ShowStore/useFetchCust";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import useSearchHeaderView from "../../store/ShowStore/useSearchHeaderView";
import useSearchHeaderDeleteCheck from "../../store/Checker/useSearchHeaderDeleteCheck";
import useSearchHeaderDelete from "../../store/DeleteStore/useSearchHeaderDelete";
import getPrintDafa from "./PrintDafa";
function SearchHeaderview() {
  //---------other state-------
  const location = useLocation();
  const { custId, customertype } = location?.state || {};

  //------use state hooks----------//
  const [searchParams] = useSearchParams();
  let entityType =
    searchParams.get("type") === "wholesaler"
      ? 2
      : searchParams.get("type") === "customer"
      ? 1
      : 3;
  entityType = customertype ? customertype : entityType;
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
    name: null,
  });
  const [selectedEntityId, setSelectedEntityId] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    page: 1,
    limit: 10,
    view: false,
    Lotno: null,
    Status: 2,
    StartDate: null,
    EndDate: null,
    view1: false,
    view2: false,
    headerData: {},
    SearchFor: "",
    warehouse: null
  });
  const [initialCustId, setInitialCustId] = useState(custId || -1);
  const [searchDate, setSearchDate] = useState("");
  const [view, setView] = useState({
    View1: false,
    View2: false,
  });

  //-----------------------api calls--------------------------------

  const { user, CompanyID } = useFetchAuth();
  // const { isAdjustDetailError } = useFetchAdjustDetailReport();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();
  const { fetchMahajonData, MahajonList } = useFetchMahajon();
  const { CustomerList, fetchCustomrData } = useFetchCust();
  const {
    DueSearchHeaderViewList,
    isDueSearchHeaderViewListLoading,
    isDueSearchHeaderViewListError,
    ClearstateDueSearchHeaderViewList,
    searchDueSearchHeaderViewHeader,
    // DueSearchHeaderViewErrMsg,
  } = useSearchHeaderView();

  const {
    ClearSearchHeaderDeleteCheck,
    SearchHeaderDeleteCheck,
    SearchHeaderDeleteCheckErr,
    isSearchHeaderDeleteCheckLoading,
    isSearchHeaderDeleteCheck,
    SearchHeaderDeleteCheckMsg,
  } = useSearchHeaderDeleteCheck();

  const {
    ClearSearchHeaderDelete,
    DeleteSearchHeader,
    SearchHeaderDeleteErr,
    isSearchHeaderDeleteLoading,
    isSearchHeaderDeleteSucc,
    SearchHeaderDeleteMsg,
  } = useSearchHeaderDelete();

  //--------------------------function call-----------------------------

  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteSearchHeader({
        HeaderID: itemToDelete.ID,
      });
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  const handleDeleteClick = (index) => {
    const selectedData = filteredData[index];
    setItemToDelete(selectedData);
    SearchHeaderDeleteCheck({ HeaderID: selectedData.ID });
  };
  //sorting
  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;
    let currentOrder = "";
    let isAsc = false;
    let isDesc = false;
    if (type == "time") {
      for (let i = 0; i < filteredData.length - 1; i++) {
        let a = parseInt(
          (filteredData[i]?.[header]).toString().replace(/:/g, ""),
          10
        );
        let b = parseInt(
          (filteredData[i + 1]?.[header]).toString().replace(/:/g, ""),
          10
        );
        if (a > b) {
          isAsc = true;
        }
        if (b > a) {
          isDesc = true;
        }
      }
      if (isAsc) {
        currentOrder = "Desc";
      }
      if (isDesc) {
        currentOrder = "Asc";
      }
    } else {
      currentOrder = checkOrder(filteredData, header);
    }
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    } else if (type == "BongDate") {
      result = BongDateSorting(newOrder, filteredData, header);
    } else if (type == "time") {
      result = SortArrayByTime(newOrder, filteredData, header);
    }

    setFilteredData(result);
    // setOriginalOrder(result.map((row) => row.ID));
  };
  // Calendar handlers
  const handleShow1 = () => {
    setView({ ...view, View1: true });
  };
  const handleShow2 = () => {
    setView({ ...view, View2: true });
  };
  const HandleInputDateRange = (val, name) => {
    setFilters({ ...Filters, [name]: val });
  };
  const handleModalClose = () => {
    setParams((prev) => ({ ...prev, view: false }));
  };

  const handleViewClick = (tabindex) => {
    const selectedData = filteredData[tabindex];
    setSelectedId(selectedData.ID);

    setParams((prev) => ({
      ...prev,
      view: true, // Trigger modal to open
      Lotno: selectedData.LotNo,
      headerData: selectedData, // Pass entire row data
      SRL: selectedData?.SRL,
      Valuation: selectedData.Valuation,
    }));
  };
  // Search functionality
  const performSearch = () => {
    searchDueSearchHeaderViewHeader({
      Cust_ID: selectedEntityId,
      CompanyID: user?.CompanyID,
      Cust_Type: entityType,
      StartDate: Filters?.StartDate,
      EndDate: Filters?.EndDate,
    });
  };

  const handlePrintDafa = ()=>{
    // console.log(originalOrder, "here print");
    // setOriginalOrder((prev) => {
    //   return prev.map((item) => {
    //     return {
    //       ...item,
    //       Lot_date: `${item.LotNo}-${item.ItemDate}`,
    //     };
    //   });
    // });
    const changedarray = originalOrder.map((item) => {
      return {
        ...item,
        Lot_date: `${item.LotNo}-${item.ItemDate}`,
      };
    });
    getPrintDafa(changedarray, entityType, params?.SearchFor);
  }

  const handleWholesalerChange = (e) => {
    const value = e.target.value;
    setSelectedEntityId(value);
    let seracharr = entityType == 3 ? mjon : entityType == 2 ? wholeseller : customer;
    let objarr=seracharr?.filter((item) => item?.value == value);
    setParams((prev) => ({ ...prev, SearchFor: objarr[0]?.label }));
    setFilters((prev) => ({ ...prev, name: value }));
  };
  //--------------------------useEffects-----------------------------

  useEffect(() => {
    if (entityType == 2) {
      fetchWSomrData({ CompanyID: user?.CompanyID });
    } else if (entityType == 3) {
      fetchMahajonData({ Cust_Type: entityType, CompanyID });
    } else if (entityType == 1) {
      fetchCustomrData({ Cust_Type: entityType, CompanyID });
    }
    return () => {
      setFilteredData([]);
      setSearchTerm("");
      setSelectedEntityId(-1);
      setFilters({
        StartDate: null,
        EndDate: null,
        name: null,
      });
    };
  }, [entityType]);

  //delete response
  useEffect(() => {
    // toast.dismiss();
    if (isSearchHeaderDeleteSucc && !isSearchHeaderDeleteLoading) {
      toast.success(SearchHeaderDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (SearchHeaderDeleteErr && !isSearchHeaderDeleteLoading) {
      toast.error(SearchHeaderDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    ClearSearchHeaderDelete();
    // return () => clearTimeout(timeid);
  }, [
    SearchHeaderDeleteErr,
    isSearchHeaderDeleteSucc,
    isSearchHeaderDeleteLoading,
  ]);

  //delete check
  useEffect(() => {
    if (isSearchHeaderDeleteCheck == 1 && !isSearchHeaderDeleteCheckLoading) {
      setShowDeleteModal(true);
    }
    if (isSearchHeaderDeleteCheck == 0 && !isSearchHeaderDeleteCheckLoading) {
      toast.error(SearchHeaderDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearSearchHeaderDeleteCheck();
  }, [isSearchHeaderDeleteCheck, isSearchHeaderDeleteCheckLoading]);

  // Modified data fetch useEffect
  useEffect(() => {
    if (
      Filters?.name !== -1 &&
      Filters?.name !== 0 &&
      Filters?.name !== null &&
      Filters?.name !== undefined
    ) {
      if (searchTerm === "" && !searchDate) {
        setFilteredData([]);
        performSearch();
      }
      if (
        searchTerm.trim() ||
        searchDate ||
        (Filters?.StartDate && Filters?.EndDate)
      ) {
        const debounceTimer = setTimeout(() => {
          performSearch();
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
    } else {
      return;
    }
  }, [searchDate, searchTerm, Filters,isSearchHeaderDeleteSucc]);

  // Update filtered data when EntryList changes
  useEffect(() => {
    if (isDueSearchHeaderViewListError) {
      setFilteredData([]);
    } else {
      if (searchDate || initialCustId) {
        setFilteredData(DueSearchHeaderViewList);
      }
    }

    if (!searchDate && !searchTerm && !initialCustId) {
      setFilteredData([]);
    }
  }, [
    DueSearchHeaderViewList,
    searchDate,
    isDueSearchHeaderViewListLoading,
    isDueSearchHeaderViewListError,
  ]);
  // Reset filteredData when entityType changes
  useEffect(() => {
    setFilteredData(() => []);
    setSearchTerm("");
    setSearchDate("");
    ClearstateDueSearchHeaderViewList();
  }, [entityType]);

  const mjon = useMemo(() => {
    if (MahajonList?.length > 0) {
      const formattedMahajon = MahajonList.map((mjon) => ({
        label: mjon.Name,
        value: mjon.ID,
      }));
      return formattedMahajon;
    } else {
      return [];
    }
  }, [MahajonList]);

  const customer = useMemo(() => {
    return CustomerList.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [CustomerList]);

  const wholeseller = useMemo(() => {
    return WholeSellerList.map((item) => ({
      label: `${item?.Name}`,
      value: item?.ID,
    }));
  }, [WholeSellerList]);

  //-------------------------variables call-----------------------------

  const columns = [
    {
      headername: "ID",
      fieldname: "ID",
      type: "number",
      isNotEditable: true,
      width: "40px",
    },
    {
      headername: "Name",
      fieldname: "CustomerName",
      type: "String",
    },
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "BongDate",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col
          xl={4}
          lg={4}
          md={6}
          sm={12}
          xs={12}
          className="text-md-start text-sm-center"
        >
          <h5 className="mt-2">
            {entityType == 2
              ? "Search Wholesaler View"
              : entityType == 3
              ? "Search Mahajon View"
              : entityType == 1 && "Search Customer View"}
          </h5>
        </Col>
        <Col xl={4} lg={5} md={6} sm={12} xs={12} className="my-2">
          <BongDatePicker
            view1={view?.View1}
            view2={view?.View2}
            endDate={Filters?.EndDate}
            startDate={Filters?.StartDate}
            handleChange={HandleInputDateRange}
            handleClose={handleModalClose}
            handleOpenEndDate={handleShow2}
            handleOpenStartDate={handleShow1}
          />
        </Col>
        <Col xl={4} lg={3} md={12} sm={12} xs={12} className="my-2">
          <SearchableDropDown
            options={
              entityType == 2 ? wholeseller : entityType == 1 ? customer : mjon
            }
            handleChange={handleWholesalerChange}
            selectedVal={Filters?.name}
            label={"name"}
            placeholder={
              entityType == 2
                ? "--Select Wholesaler--"
                : entityType == 1
                ? "--Select Customer--"
                : "--Select Mahajon--"
            }
            defaultval={-1}
            width={"100%"}
          />
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <hr className="my-2"/>
        </Col>
        {/* Table */}
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="table-box">
            {filteredData?.length > 0 ? (
              <Table
                Col={columns}
                onSorting={SortingFunc}
                tab={filteredData || []}
                isLoading={isDueSearchHeaderViewListLoading}
                isView={true}
                handleViewClick={handleViewClick}
                isDelete={true}
                handleDelete={handleDeleteClick}
              />
            ) : isDueSearchHeaderViewListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25 mt-1"
                style={{ height: "75vh" }}
              >
                <div className="text-muted">
                  {searchTerm || searchDate
                    ? "No results found. Try a different search."
                    : "Use the search bar or date picker to find entries."}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Modal */}
        <ReusableModal
          Title={"Search Details"}
          show={params?.view}
          handleClose={handleModalClose}
          isFullScreen={true}
          body={
            <SearchDetails
              id={selectedId}
              lotno={params?.Lotno}
              onCloseHandler={handleModalClose}
              entityType={entityType}
              headerData={params?.headerData}
              setDetailData={setOriginalOrder}
              SearchFor={params?.SearchFor}
            />
          }
          isPrimary={true}
          handlePrimary={handleModalClose}
          PrimaryButtonName={"Close"}
          isSuccess={true}
          SuccessButtonName={"Print"}
          handleSuccess={handlePrintDafa}
        />

        <DeleteConfirmation
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Row>
    </Container>
  );
}

export default SearchHeaderview;
