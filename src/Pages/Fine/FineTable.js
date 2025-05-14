"use client";

import { useEffect, useRef, useState } from "react";
import Table from "../../Component/Table";
import ReusableModal from "../../Component/Modal";
import { toast } from "react-toastify";
import { Form, InputGroup } from "react-bootstrap";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
import useFetchFineDetails from "../../store/ShowStore/useFetchFineDetails";
import useEditFineHeader from "../../store/UpdateStore/useEditFineHeader";
import useAddFine from "../../store/AddStore/useAddFine";
import useEditFineDetails from "../../store/UpdateStore/useEditFineDetails";
import useFineHeaderDelete from "../../store/DeleteMasterStore/useFineHeaderDelete";
import useFineDetailDelete from "../../store/DeleteMasterStore/useFineDetailDelete";
import useAddFineDetails from "../../store/AddStore/useAddFineDetails";
import EstimateTable from "../../Component/EstimateTable";

function FineTable({ setIsDisable, search }) {
  const [editedData, setEditedData] = useState({
    fineHeaderID: null,
    CODE: null,
    DESCRIPTION: null,
  });
  const [editedDetailData, setEditedDetailData] = useState({
    fineHeaderID: null,
    fineMasterID: null,
    MONTH: "",
    FINE_PERCENTAGE: "",
  });
  const editinputref = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 90);
  }, [editedData.fineHeaderID]);
  const editinputref1 = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (editinputref1.current) {
        editinputref1.current.focus();
      }
    }, 90);
  }, [editedDetailData.fineMasterID]);

  const [detailParams, setDetailParams] = useState({
    ActionID: -1,
    IsAction: false,
    viewIndex: null,
  });
  const {
    DeleteFineDetail,
    ClearFineDetailDelete,
    FineDetailDeleteErr,
    isFineDetailDeleteLoading,
    FineDetailDeleteMsg,
  } = useFineDetailDelete();
  // console.log(editedDeatilData);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [selectedFineId, setSelectedFineId] = useState(null);

  const { CompanyID } = useFetchAuth();
  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();
  const { FineDetailsList, fetchFineDetails, isFineDetailsLoading } =
    useFetchFineDetails();
  const {
    EditFineHeaderFunc,
    FineHeaderEditError,
    isFineHeaderEditLoading,
    FineHeaderEditSuccess,
    ClearStateEditFineHeader,
  } = useEditFineHeader();
  const {
    EditFineDetailsFunc,
    FineDetailsEditError,
    isFineDetailsEditLoading,
    FineDetailsEditSuccess,
    ClearStateEditFineDetails,
  } = useEditFineDetails();
  const {
    DeleteFineHeader,
    ClearFineHeaderDelete,
    FineHeaderDeleteErr,
    isFineHeaderDeleteLoading,
    FineHeaderDeleteMsg,
  } = useFineHeaderDelete();
  const { FineAddSuccess } = useAddFine();
  const {
    FineDetailsAddSuccess,
    FineDetailsAddError,
    FineDetailsAdd,
    ClearStateFineDetailsAdd,
  } = useAddFineDetails();

  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    viewIndex: null,
  });

  useEffect(() => {
    fetchFineHeader({ CompanyID });
    if (originalOrder.length > 0 && FineHeaderList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => FineHeaderList.find((row) => row.ID === id))
        .filter(Boolean);
      setFilteredData(sortedData);
    }
  }, [FineAddSuccess, FineHeaderEditSuccess, FineHeaderDeleteMsg]);

  useEffect(() => {
    if (FineHeaderList?.length > 0) {
      setFilteredData(FineHeaderList);
    }
  }, [FineHeaderList]);

  useEffect(() => {
    if (selectedFineId) {
      fetchFineDetails({ HeaderID: selectedFineId, CompanyID });
    }
  }, [selectedFineId, FineDetailsEditSuccess, FineDetailDeleteMsg]);

  useEffect(() => {
    if (selectedFineId && FineDetailsList.length > 0) {
      setDetailData(FineDetailsList);
      setShowModal(true);
    }
  }, [FineDetailsList, selectedFineId, FineDetailsEditSuccess]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  const Col = [
    {
      headername: "Fine Code",
      fieldname: "CODE",
      type: "String",
      width: "200px",
      isUseInputRef: true,
    },
    {
      headername: "Description",
      fieldname: "DESCRIPTION",
      type: "String",
      width: "200px",
    },
  ];

  const detailCol = [
    {
      headername: "Month",
      fieldname: "MONTH",
      type: "number",
      isUseInputRef: true,
    },
    { headername: "Percentage", fieldname: "FINE_PERCENTAGE", type: "number" },
  ];

    const detailColumns = [
      {
        label: "Month*",
        key: "MONTH",
        type: "number",
        PlaceHolder: "Enter Month (1-12)",
        width: "200px",
        proprefs: true,
      },
      {
        label: "Fine Percentage (%)*",
        key: "FINE_PERCENTAGE",
        type: "number",
        PlaceHolder: "Enter Percentage",
        width: "250px",
      },
    ];
  const ActionFunc = (tabIndex) => {
    const selectedData = filteredData[tabIndex];
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setIsDisable(true);

    setEditedData({
      fineHeaderID: selectedData.ID,
      CODE: selectedData.CODE,
      DESCRIPTION: selectedData.DESCRIPTION,
    });
  };

  const ActionFunc1 = (tabIndex) => {
    const selectedDetail = detailData[tabIndex];
    setDetailParams({ IsAction: true, ActionID: tabIndex });
    setIsDisable(true);

    setEditedDetailData({
      fineHeaderID: selectedFineId,
      fineMasterID: selectedDetail.ID,
      MONTH: selectedDetail.MONTH,
      FINE_PERCENTAGE: selectedDetail.FINE_PERCENTAGE,
    });
  };

  const handleViewClick = (index) => {
    setSelectedFineId(filteredData[index].ID);
  };

  const handleSearch = (e) => {
    const value = search.toLowerCase().trim(); // trim to ignore whitespace

    // if (value === "") {
    //   setFilteredData(FineHeaderList); // show all rows if search is empty
    //   return;
    // }

    const validFields = Col.map((col) => col.fieldname);

    const filtered = FineHeaderList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  const SortingFunc = (header, type) => {
    if (!filteredData.length) return;
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    switch (type) {
      case "String":
        result = SortArrayByString(newOrder, filteredData, header);
        break;
      case "Date":
        result = SortArrayByDate(newOrder, filteredData, header);
        break;
      case "number":
        result = SortArrayByNumber(newOrder, filteredData, header);
        break;
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };

  const SortingFuncDetail = (header, type) => {
    if (!detailData.length) return;
    const currentOrder = checkOrder(detailData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    switch (type) {
      case "String":
        result = SortArrayByString(newOrder, detailData, header);
        break;
      case "Date":
        result = SortArrayByDate(newOrder, detailData, header);
        break;
      case "number":
        result = SortArrayByNumber(newOrder, detailData, header);
        break;
    }

    setDetailData(result);
  };

  const SaveChange = () => {
    if (!editedData.CODE || !editedData.DESCRIPTION) {
      toast.error("Code and Description are required!");
      return;
    }

    EditFineHeaderFunc(editedData);
  };

  const handleEditChange = (index, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFineId(null); // Reset selectedFineId
  };
  useEffect(() => {
    // if (isFineHeaderEditLoading && !FineHeaderEditSuccess && !FineHeaderEditError) {
    //   toast.info("Please wait...", { position: "top-right", autoClose: 1000 });
    // } else
    if (
      FineHeaderEditSuccess &&
      !isFineHeaderEditLoading &&
      !FineHeaderEditError
    ) {
      toast.success("Fine Header Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        companyId: null,
        CompanyName: "",
        ContactNumber: "",
        Email: "",
        Website: "",
        Logo: "",
        DefaultFinePercentage: "",
        GSTIN: "",
        PAN: "",
        Address: "",
      });
      setIsDisable(false);
    } else if (
      FineHeaderEditError &&
      !isFineHeaderEditLoading &&
      !FineHeaderEditSuccess
    ) {
      toast.error(FineHeaderEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditFineHeader();
  }, [isFineHeaderEditLoading, FineHeaderEditSuccess, FineHeaderEditError]);

  useEffect(() => {
    // if (isFineHeaderEditLoading && !FineHeaderEditSuccess && !FineHeaderEditError) {
    //   toast.info("Please wait...", { position: "top-right", autoClose: 1000 });
    // } else
    if (
      FineDetailsEditSuccess &&
      !isFineDetailsEditLoading &&
      !FineDetailsEditError
    ) {
      toast.success("Fine Details Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setDetailParams({ ActionID: -1, IsAction: false });
      setEditedData({
        companyId: null,
        CompanyName: "",
        ContactNumber: "",
        Email: "",
        Website: "",
        Logo: "",
        DefaultFinePercentage: "",
        GSTIN: "",
        PAN: "",
        Address: "",
      });
      setIsDisable(false);
    } else if (
      FineDetailsEditError &&
      !isFineDetailsEditLoading &&
      !FineDetailsEditSuccess
    ) {
      toast.error(FineDetailsEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditFineDetails();
  }, [isFineDetailsEditLoading, FineDetailsEditSuccess, FineDetailsEditError]);
  // Proper detail change handler
  const handleEditDetailChange = (index, e) => {
    const { name, value } = e.target;
    setEditedDetailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Proper save handler for details
  const SaveDetailChange = () => {
    if (!editedDetailData.MONTH || !editedDetailData.FINE_PERCENTAGE) {
      toast.error("Month and Percentage are required!");
      return;
    }

    const monthValue = Number.parseInt(editedDetailData.MONTH, 10);
    if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
      toast.error("Month should be between 1-12");
      return;
    }
    if (Number(editedDetailData.FINE_PERCENTAGE) < 0) {
      toast.error("Percentage should be greater than 0");
      return;
    }
    // You'll need to implement or use the proper edit function for details
    EditFineDetailsFunc(editedDetailData); // Update this to your actual detail edit function
  };

  useEffect(() => {
    if (FineHeaderDeleteMsg) {
      toast.success(FineHeaderDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (FineHeaderDeleteErr) {
      toast.error(FineHeaderDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearFineHeaderDelete();
  }, [FineHeaderDeleteErr, isFineHeaderDeleteLoading, FineHeaderDeleteMsg]);

  const handleDelete = (id) => {
    const deleteobj = filteredData[id];
    // console.log(deleteobj);
    if (deleteobj) {
      DeleteFineHeader({ CompanyID: CompanyID, ID: deleteobj.ID });
    }
  };

  useEffect(() => {
    if (FineDetailDeleteMsg) {
      toast.success(FineDetailDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (FineDetailDeleteErr) {
      toast.error(FineDetailDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearFineDetailDelete();
  }, [FineDetailDeleteErr, isFineDetailDeleteLoading, FineDetailDeleteMsg]);

  const handleDelete1 = (id) => {
    const deleteobj = detailData[id];
    // console.log(deleteobj);
    if (deleteobj) {
      DeleteFineDetail({ ID: deleteobj.ID, CompanyID: CompanyID });
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [rows, setRows] = useState([
    {
      rowid: 1,
      MONTH: "",
      FINE_PERCENTAGE: "",
      HeaderId: selectedFineId,
    },
  ]);
  const inputRef2 = useRef(null);
  const validateFinePercentage = (value) => {
    const regex = /^\d{0,2}(\.\d{0,2})?$/;
    return regex.test(value);
  };

  const handleDetailChange = (rowIndex, colKey, e) => {
    const updatedRows = [...rows];
    const value = e.target.value;

    if (colKey === "FINE_PERCENTAGE" && !validateFinePercentage(value)) return;

    if (colKey === "MONTH") {
      const monthValue = Number.parseInt(value, 10);
      if (monthValue < 1 || monthValue > 12) return;
    }

    updatedRows[rowIndex][colKey] = value;
    setRows(updatedRows);
  };

   const deleteRow = (id) => {
     const existingRows = rows.filter((row) => row.rowid !== id);
     const n = existingRows?.length;
     for (let i = 0; i < n; i++) {
       existingRows[i].rowid = i + 1;
     }
     setRows(existingRows);
   };

  const addRow = () => {
    const newRow = {
      rowid: rows.length + 1,
      MONTH: "",
      FINE_PERCENTAGE: "",
      HeaderId: selectedFineId,
    };
    setRows([...rows, newRow]);
  };

  const isFormValid = () => {
    return rows.some((row) => row.MONTH && row.FINE_PERCENTAGE);
  };

  const saveNewRows = () => {
    // Validate rows before saving
    const invalidRows = rows.filter(
      (row) => !row.MONTH || !row.FINE_PERCENTAGE
    );

    if (invalidRows.length > 0) {
      toast.error(
        "Please fill all required fields correctly. Month must be between 1 and 12."
      );
      return;
    }

    // Prepare data for API
    const detailsToAdd = rows.map((row) => ({
      HeaderID: selectedFineId,
      CompanyID: CompanyID,
      MONTH: row.MONTH,
      FINE_PERCENTAGE: row.FINE_PERCENTAGE,
    }));

    // Call API to add details
    FineDetailsAdd(detailsToAdd);

    // Reset form
    setShowAddForm(false);
    setRows([
      {
        rowid: 1,
        MONTH: "",
        FINE_PERCENTAGE: "",
        HeaderId: selectedFineId,
      },
    ]);

    // Refresh details data
    fetchFineDetails({ HeaderID: selectedFineId, CompanyID });
  };

  useEffect(() => {
    if (FineDetailsAddSuccess) {
      toast.success("Fine details added successfully");
      fetchFineDetails({ HeaderID: selectedFineId, CompanyID });
      ClearStateFineDetailsAdd();
    }
    if (FineDetailsAddError) {
      toast.error(FineDetailsAddError);
      ClearStateFineDetailsAdd();
    }
  }, [FineDetailsAddSuccess, FineDetailsAddError]);





  return (
    <div
      className="table-box"
      style={{ height: "60vh", border: "1px solid lightgrey" }}
    >
      <Table
        tab={filteredData}
        isAction={params.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params.ActionID}
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        isView={true}
        handleViewClick={handleViewClick}
        isLoading={isFineHeaderLoading}
        EditedData={editedData}
        OnChangeHandler={handleEditChange}
        OnSaveHandler={SaveChange}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
      />

      <ReusableModal
        show={showModal}
        handleClose={handleCloseModal} // Use the new function
        Title={`Fine Details - ${
          filteredData.find((row) => row.ID === selectedFineId)?.CODE || "N/A"
        }`}
        body={
          <>
            <InputGroup className="mb-3 search-bar" style={{ width: "40%" }}>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                className="custom-search"
              />
            </InputGroup>
            <Table
              tab={detailData.filter(
                (item) =>
                  item.MONTH.toString().includes(modalSearchQuery) ||
                  item.FINE_PERCENTAGE.toString().includes(modalSearchQuery)
              )}
              onSorting={SortingFuncDetail}
              Col={detailCol}
              isAction={detailParams.IsAction}
              ActionFunc={ActionFunc1}
              ActionId={detailParams.ActionID}
              isLoading={isFineDetailsLoading}
              isEdit={true}
              EditedData={editedDetailData}
              OnChangeHandler={handleEditDetailChange}
              OnSaveHandler={SaveDetailChange}
              useInputRef={editinputref1}
              isDelete={true}
              handleDelete={handleDelete1}
            />

            <div className="d-flex justify-content-end mb-3 mt-4">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "Hide Form" : "Add New Rows"}
              </button>
            </div>

            {showAddForm && (
              <>
                <div className="border p-3 mb-3">
                  <div className="d-flex justify-content-between mb-3">
                    <h5>Add New Fine Details</h5>
                    <div>
                      <button className="btn btn-success me-2" onClick={addRow}>
                        Add Row
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={saveNewRows}
                        disabled={!isFormValid()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <EstimateTable
                    columns={detailColumns}
                    rows={rows || []}
                    handleChange={handleDetailChange}
                    deleteRow={deleteRow}
                    isDelete={true}
                    id={"rowid"}
                    priorityref={inputRef2}
                  />
                </div>
              </>
            )}
          </>
        }
        PrimaryButtonName="Close"
        isPrimary={true}
        handlePrimary={handleCloseModal} // Use the same function
        isSuccess={false}
      />
    </div>
  );
}

export default FineTable;
