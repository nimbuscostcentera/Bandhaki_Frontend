import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./openentry.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { Row, Col, Form, Container, InputGroup } from "react-bootstrap";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";

import Table from "../../Component/Table";
import SelectOption from "../../Component/SelectOption";
import ReusableModal from "../../Component/ReusableModal";
import OpeningEntryDetailTable from "./OpeningEntryDetailTable";
import DeleteConfirmation from "../../Component/ReusableDelete";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWareHouse from "../../store/ShowStore/useFetchWareHouse";
import useCheckOpeningHeader from "../../store/Checker/useCheckOpeningHeader";
import useOpeningHeaderEdit from "../../store/UpdateStore/useOpeningHeaderEdit";
import useOpeningHeaderDelete from "../../store/DeleteStore/useOpeningHeaderDelete";
import useFetchOpeningEntryHeader from "../../store/ShowStore/useFetchOpningEntryHeader";
import useOpeningHeaderDeleteCheck from "../../store/Checker/useOpeningHeaderDeleteCheck";

function OpeningEntryViewReport() {
  //-----------------------------------hooks-----------------------------------//
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get("type") === "customer" ? 1 : 2;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const editinputref = useRef(null);
  //------------------------------------useStatehook---------------------------------//
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    page: 1,
    limit: 10,
    view: false,
    Lotno: "",
    Status:-1
  });
  const [textDetail, setTextDetail] = useState("");
  //---------------------------------------------API Call------------------------------------//
  const { user, CompanyID } = useFetchAuth();
  const {
    CheckOpeningHeaderMsg,
    isCheckOpeningHeaderLoading,
    CheckOpeningHeaderErr,
    isCheckOpHeader,
    CheckOpeningHeader,
    ClearCheckOpeningHeader,
  } = useCheckOpeningHeader();
  const {
    CheckOpeningHeaderDeleteCheckMsg,
    isCheckOpeningHeaderDeleteCheck,
    isCheckOpeningHeaderDeleteCheckLoading,
    CheckOpeningHeaderDeleteCheckErr,
    CheckOpeningHeaderDeleteCheck,
    ClearCheckOpeningHeaderDeleteCheck,
  } = useOpeningHeaderDeleteCheck();
  const {
    EntryList,
    pagination,
    isEntryListLoading,
    isEntryListError,
    ClearstateEntryList,
    fetchOpeningEntryHeader,
    searchOpeningEntryHeader,
  } = useFetchOpeningEntryHeader();
  const {
    EditOpeningHeaderFunc,
    isOpeningHeaderEditLoading,
    OpeningHeaderEditSuccess,
    ClearStateEditOpeningHeader,
    OpeningHeaderEditError,
  } = useOpeningHeaderEdit();
  const { WareHouseList, fetchWareHouse } = useFetchWareHouse();
  const {
    DeleteOpeningHeader,
    ClearOpeningHeaderDelete,
    OpeningHeaderDeleteErr,
    isOpeningHeaderDeleteLoading,
    OpeningHeaderDeleteMsg,
  } = useOpeningHeaderDelete();
  const { totalPages, currentPage, totalRecords, limit } = pagination;
  //---------------------------------------functions------------------------------------//
  const handleDeleteClick = (index) => {
    const deleteobj = filteredData[index];
    // Immediately set the item to delete
    setItemToDelete(deleteobj);
    // Initiate the delete check
    CheckOpeningHeaderDeleteCheck({
      ID: deleteobj.ID,
      Cust_Type: entityType,
    });
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await DeleteOpeningHeader({
          ID: itemToDelete.ID,
          Cust_Type: entityType,
        });
        // Refresh data after successful deletion
        fetchOpeningEntryHeader({
          CompanyID: user?.CompanyID,
          page: params.page,
          limit: params.limit,
          Cust_Type: entityType,
          Status:params?.Status
        });
      } finally {
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;

    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    } else if ((type = "BongDate")) {
      result = BongDateSorting(newOrder, filteredData, header);
    }
    console.log(result);
    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };

  //after hit edit button
  const FetchActionId = (index) => {
    // setParams((prev) => ({ ...prev, SelectedID: index, isAction: true }));
    const editableobj = filteredData[index];
    CheckOpeningHeader({ ID: editableobj.ID, Cust_Type: entityType });
    setSelectedId(index);
    // Find the warehouse ID based on the warehouse code
    const selectedWarehouse = WareHouseList.find(
      (warehouse) => warehouse.CODE === editableobj.WarehouseCode
    );

    // Create the edited data object with only the editable fields
    const obj = {
      ID: editableobj.ID,
      WarehouseID: selectedWarehouse ? selectedWarehouse.ID : "", // Use ID property, not the whole object
      PacketNo: editableobj.PacketNo,
      WarehouseCode: editableobj.WarehouseCode,

      // Include non-editable fields for reference but they won't be editable in the UI
      // These fields will be displayed but not editable due to the isNotEditable flag in columns
      EntryDate: editableobj.EntryDate,
      CostCenterCode: editableobj.CostCenterCode,
      LotNo: editableobj.LotNo,
      CustomerName: editableobj.CustomerName,
    };

    setEditedData(obj);
  };

  const handleClose = () => {
    setParams({ ...params, view: false });
  };
  const SaveHandler = (index) => {
    // console.log({ ...editedData, LotNo: lotno });
    EditOpeningHeaderFunc({
      ID: editedData.ID,
      PacketNo: editedData.PacketNo,
      WarehouseID: editedData.WarehouseID,
      Cust_Type: entityType,
    });
  };
  //----------------------------------------------useEffects------------------------------------------//
  useEffect(() => {
    fetchWareHouse({ CompanyID });
  }, []);

  useEffect(() => {
    if (isCheckOpHeader == 1) {
      // If check passes, show the delete confirmation modal
      setParams((prev) => ({
        ...prev,
        IsAction: true,
        ActionID: selectedId,
      }));
    } else if (isCheckOpHeader == 0) {
      toast.warning(CheckOpeningHeaderErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckOpeningHeader();
  }, [isCheckOpeningHeaderLoading, isCheckOpHeader]);

  // Handle search input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (user?.CompanyID) {
        // If search term exists, use search function
        searchOpeningEntryHeader({
          CompanyID: user?.CompanyID,
          keyword: searchTerm,
          page: params.page,
          limit: params.limit,
          Cust_Type: entityType,
          Status:params?.Status
        });
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [
    searchTerm,
    params.page,
    params.limit,
    user?.CompanyID,
    OpeningHeaderDeleteMsg,
    OpeningHeaderEditSuccess,
  ]);

  // Initial data load
  useEffect(() => {
    if (user?.CompanyID && searchTerm === "") {
      fetchOpeningEntryHeader({
        CompanyID: user?.CompanyID,
        keyword: "",
        page: params.page,
        limit: params.limit,
        Cust_Type: entityType,
        Status:params?.Status
      });
    }
  }, [
    params.page,
    params.limit,
    params?.Status,
    user?.CompanyID,
    OpeningHeaderDeleteMsg,
    OpeningHeaderEditSuccess,
    entityType,
  ]);

  // Update filtered data when EntryList changes
  useEffect(() => {
    if (originalOrder.length > 0 && EntryList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => EntryList.find((row) => row.ID === id))
        .filter(Boolean);
      setFilteredData(sortedData);
    } else {
      setFilteredData(EntryList);
    }
    ClearstateEntryList();
  }, [EntryList, OpeningHeaderDeleteMsg, OpeningHeaderEditSuccess]);

  useEffect(() => {
    if (OpeningHeaderEditSuccess) {
      toast.success(OpeningHeaderEditSuccess, {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ...params, SelectedID: -1, ActionID: -1, IsAction: false });
      setEditedData({});
    }
    if (OpeningHeaderEditError) {
      toast.error(OpeningHeaderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditOpeningHeader();
  }, [
    isOpeningHeaderEditLoading,
    OpeningHeaderEditSuccess,
    OpeningHeaderEditError,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.ID]);

  // Updated useEffect for delete check
  useEffect(() => {
    if (isCheckOpeningHeaderDeleteCheck === 1 && itemToDelete) {
      setShowDeleteModal(true);
      ClearCheckOpeningHeaderDeleteCheck();
    } else if (isCheckOpeningHeaderDeleteCheck === 0) {
      toast.warning(CheckOpeningHeaderDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
      ClearCheckOpeningHeaderDeleteCheck();
      // setItemToDelete(null);
    }
  }, [isCheckOpeningHeaderDeleteCheck, itemToDelete]);

  useEffect(() => {
    if (OpeningHeaderDeleteMsg) {
      toast.success(OpeningHeaderDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (OpeningHeaderDeleteErr) {
      toast.error(OpeningHeaderDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearOpeningHeaderDelete();
  }, [
    OpeningHeaderDeleteErr,
    isOpeningHeaderDeleteLoading,
    OpeningHeaderDeleteMsg,
  ]);
  //----------------------------------------------const & var-----------------------------------------//
  const selectwarehouse = useMemo(() => {
    return WareHouseList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
  }, [WareHouseList]);

  const columns = [
    {
      headername: "Entry Date",
      fieldname: "EntryDate",
      type: "BongDate",
      isNotEditable: true,
    },
    {
      headername: "Packet No",
      fieldname: "PacketNo",
      type: "String",
      isUseInputRef: true,
    },
    {
      headername: "Cost Center",
      fieldname: "CostCenterCode",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "LotNo",
      fieldname: "LotNo",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: entityType == 1 ? "Customer Name" : "WholeSeller Name",
      fieldname: "CustomerName",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "Warehouse Code",
      type: "String",
      fieldname: "WarehouseCode",
      selectionname: "WarehouseID",
      isSelection: true,
      options: selectwarehouse,
    },
    {
      headername: "Cloing Status",
      fieldname: "Status",
      type: "String",
      isNotEditable: true,
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer autoClose={3000} />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h5 style={{ fontSize: "18px" }}>
                Opening Entries for {entityType == 1 ? "Customer" : "WholeSeller"}
              </h5>
            </div>

            {/* Detail View + Search grouped together */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-2">
              <div>
                <SelectOption
                  OnSelect={(e) => {
                    setParams((prev) => ({
                      ...prev,
                      Status: e?.target?.value,
                    }));
                  }}
                  SelectStyle={{
                    width: "150px",
                    padding: "7px 8px",
                  }}
                  PlaceHolder={"--Select Status--"}
                  SName={"Status"}
                  Value={params?.Status}
                  Soptions={[
                    { Name: "All", Value: -1 },
                    { Name: "Running", Value: 2 },
                    { Name: "Closed", Value: 1 },
                  ]}
                />
              </div>
              <input
                value={textDetail}
                readOnly
                type="search"
                placeholder="Detail View"
                style={{
                  width: "240px",
                  border: "1px solid dodgerblue",
                  outline: "none",
                  borderRadius: "5px",
                  padding: "3px 12px",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(0, 123, 255, 0.25)",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                }}
              />

              <input
                autoFocus
                placeholder="Search here..."
                aria-label="search"
                aria-describedby="basic-addon1"
                style={{
                  width: "280px",
                  border: "1px solid dodgerblue",
                  outline: "none",
                  borderRadius: "5px",
                  padding: "3px 12px",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(0, 123, 255, 0.25)",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <hr className="my-1" />
        </Col>

        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div
            className="table-box"
            style={{ height: "68vh", border: "1px solid lightgrey" }}
          >
            <Table
              Col={columns}
              tab={filteredData || []}
              isLoading={isEntryListLoading}
              onSorting={SortingFunc}
              OnChangeHandler={OnChangeHandler}
              // ActionId={params?.SelectedID}
              ActionId={params?.ActionID}
              ActionFunc={FetchActionId}
              isEdit={true}
              isView={true}
              isDelete={true}
              handleViewClick={(index) => {
                const selectedData = filteredData[index];
                setSelectedId(selectedData.ID);
                setParams({
                  ...params,
                  view: true,
                  Lotno: selectedData?.LotNo,
                });
              }}
              EditedData={editedData}
              OnSaveHandler={SaveHandler}
              PageNumber={params?.page}
              rowsperpage={params?.limit}
              // handleDelete={handleDelete}
              handleDelete={handleDeleteClick}
              useInputRef={editinputref}
              getFocusText={(val) => {
                setTextDetail(val);
              }}
            />
            <DeleteConfirmation
              show={showDeleteModal}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              isLoading={isOpeningHeaderDeleteLoading}
            />
          </div>
        </Col>
        {/* Pagination Section */}
        <Col xl={6} lg={6} md={6} sm={12} xs={12} className="mt-2">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {/* Dynamic Page Numbers */}
              {(() => {
                const pageNumbers = [];
                let start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);

                if (end === totalPages) {
                  start = Math.max(1, totalPages - 4);
                }

                for (let i = start; i <= end; i++) {
                  pageNumbers.push(i);
                }

                return pageNumbers.map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ));
              })()}

              {/* Next Button */}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </Col>
        <Col
          xl={6}
          lg={6}
          md={6}
          sm={12}
          xs={12}
          className="mt-2 d-flex justify-content-end align-items-center"
        >
          <div style={{ color: "darkgrey" }}>
            Rows Per Page: &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div>
            <Form.Group controlId="selectLimit">
              <Form.Select
                style={{ width: "100px", padding: "8px 10px", color: "grey" }}
                value={params.limit}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1, // Reset to page 1 on limit change
                  }))
                }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
      </Row>
      {/* Modal */}
      <ReusableModal
        show={params?.view}
        handleClose={handleClose}
        body={
          <OpeningEntryDetailTable
            id={selectedId}
            lotno={params?.Lotno}
            onCloseHandler={handleClose}
            entityType={entityType}
          />
        }
        Title={"Opening Entry Detail View"}
        isPrimary={true}
        handlePrimary={handleClose}
        PrimaryButtonName={"Close"}
      />
    </Container>
  );
}

export default OpeningEntryViewReport;
