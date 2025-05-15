"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col, Form, Container, InputGroup } from "react-bootstrap";
import "./openentry.css";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";

import Table from "../../Component/Table";
import ReusableModal from "../../Component/ReusableModal";
import OpeningEntryDetailTable from "./OpeningEntryDetailTable";

import useFetchOpeningEntryHeader from "../../store/ShowStore/useFetchOpningEntryHeader";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useOpeningHeaderDelete from "../../store/DeleteStore/useOpeningHeaderDelete";
// import useOpeningHeader from "../../store/UpdateStore/useOpeningHeaderEdit";
import useFetchWareHouse from "../../store/ShowStore/useFetchWareHouse";
import useOpeningHeaderEdit from "../../store/UpdateStore/useOpeningHeaderEdit";
import useCheckOpeningHeader from "../../store/Checker/useCheckOpeningHeader";
import { useSearchParams } from "react-router-dom";
import DeleteConfirmation from "../../Component/ReusableDelete";
import useOpeningHeaderDeleteCheck from "../../store/Checker/useOpeningHeaderDeleteCheck";

function OpeningEntryViewReport() {
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get("type") === "customer" ? 1 : 2;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  console.log(entityType, "entitytype in header");

  const editinputref = useRef(null);
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
  });

  const { user } = useFetchAuth();
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
  const { CompanyID } = useFetchAuth();
  useEffect(() => {
    fetchWareHouse({ CompanyID });
  }, []);

  const { totalPages, currentPage, totalRecords, limit } = pagination;

  const handleDeleteClick = (index) => {
    const deleteobj = filteredData[index];

    // Check if the opening header can be deleted first
    CheckOpeningHeaderDeleteCheck({ ID: deleteobj.ID, Cust_Type: entityType });
    setItemToDelete(deleteobj);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteOpeningHeader({ ID: itemToDelete.ID, Cust_Type: entityType });
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
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

  // Cancel delete action

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

  useEffect(() => {
    if (isCheckOpHeader == 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isCheckOpHeader == 0) {
      toast.dismiss();
      toast.warning(CheckOpeningHeaderErr, {
        position: "top-right",
        autoClose: 3000,
      });
      
    }
    ClearCheckOpeningHeader();
  }, [isCheckOpeningHeaderLoading, isCheckOpHeader]);

  useEffect(() => {
    if (isCheckOpeningHeaderDeleteCheck == 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isCheckOpeningHeaderDeleteCheck == 2) {
      toast.dismiss();
      toast.warning(CheckOpeningHeaderDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckOpeningHeaderDeleteCheck();
  }, [
    isCheckOpeningHeaderDeleteCheckLoading,
    CheckOpeningHeaderDeleteCheckErr,
  ]);
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
  const {
    DeleteOpeningHeader,
    ClearOpeningHeaderDelete,
    OpeningHeaderDeleteErr,
    isOpeningHeaderDeleteLoading,
    OpeningHeaderDeleteMsg,
  } = useOpeningHeaderDelete();

  useEffect(() => {
    if (isCheckOpeningHeaderDeleteCheck === 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
        setItemToDelete(null);
      }
    } else if (isCheckOpeningHeaderDeleteCheck === 2) {
      toast.dismiss();
      toast.warning(CheckOpeningHeaderDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
      setItemToDelete(null);
    }
    ClearCheckOpeningHeaderDeleteCheck();
  }, [isCheckOpeningHeaderDeleteCheckLoading, isCheckOpeningHeaderDeleteCheck]);


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

  const handleClose = () => {
    setParams({ ...params, view: false });
  };

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
  ];

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
      });
    }
  }, [
    params.page,
    params.limit,
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
  const SaveHandler = (index) => {
    // console.log({ ...editedData, LotNo: lotno });
    EditOpeningHeaderFunc({
      ID: editedData.ID,
      PacketNo: editedData.PacketNo,
      WarehouseID: editedData.WarehouseID,
      Cust_Type: entityType,
    });
  };
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

console.log(showDeleteModal);
  return (
    <Container fluid className="pt-5">
      <ToastContainer autoClose={3000} />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2">Opening Entry View</h5>
            </div>
            <div>
              <InputGroup className="mt-2">
                <Form.Control
                  autoFocus
                  placeholder="Search here..."
                  aria-label="search"
                  aria-describedby="basic-addon1"
                  style={{ width: "300px", zIndex: "1" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            />
            <DeleteConfirmation
              show={showDeleteModal}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
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
