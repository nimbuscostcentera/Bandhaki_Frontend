"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddFine from "../../store/AddStore/useAddFine";
import EstimateTable from "../../Component/EstimateTable";
import FineTable from "./FineTable";
import ReusableModal from "../../Component/Modal";

function FineListEdit() {
  const { CompanyID } = useFetchAuth();
  const [rows, setRows] = useState([
    {
      rowid: 1,
      MONTH: "",
      FINE_PERCENTAGE: "",
    },
  ]);
  const [searchData, setSearchData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fineData, setFineData] = useState([
    {
      id: 1,
      CompanyID: CompanyID,
      CODE: null,
      DESCRIPTION: null, // Added DESCRIPTION field
      displayString: "", // Add this line
      fine_master: [
        {
          MONTH: "",
          FINE_PERCENTAGE: "",
        },
      ],
    },
  ]);
  const inputRef1 = useRef();

  useEffect(() => {
    if (inputRef1.current) {
      inputRef1.current.focus();
    }
  }, []);
  const inputRef2 = useRef();

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        if (inputRef2.current) {
          inputRef2.current.focus();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Focus on the date field when new rows are added
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef2.current) {
        inputRef2.current.focus();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [rows.length]);

  // Updated data structure with nested data array and added DESCRIPTION field

  // console.log(fineData[0]);
  const [isDisable, setIsDisable] = useState(false);
  const {
    FineAddError,
    isFineAddLoading,
    FineAddSuccess,
    FineAdd,
    ClearStateFineAdd,
  } = useAddFine();

  const columns = useMemo(
    () => [
      {
        label: "Code*",
        key: "CODE",
        type: "text",
        PlaceHolder: "Enter Code",
        width: "150px",
        proprefs: true,
      },
      {
        label: "Description",
        key: "DESCRIPTION",
        type: "text",
        PlaceHolder: "Enter Description",
        width: "250px",
      },
      {
        label: "Fine Details*",
        key: "displayString", // Change this from 'data' to 'displayString'
        type: "String",
        isTableSelection: true,
        width: "200px",
      },
    ],
    []
  );

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

  const validateFinePercentage = (value) => {
    const regex = /^\d{0,2}(\.\d{0,2})?$/;
    return regex.test(value);
  };

  const onChangeHandler = (rowIndex, colKey, e) => {
    const updatedData = [...fineData];
    updatedData[rowIndex][colKey] = e.target.value;
    setFineData(updatedData);
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

  const addRow = () => {
    const newRow = {
      rowid: rows.length + 1,
      MONTH: "",
      FINE_PERCENTAGE: "",
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    const existingRows = rows.filter((row) => row.rowid !== id);
    const n = existingRows?.length;
    for (let i = 0; i < n; i++) {
      existingRows[i].rowid = i + 1;
    }
    setRows(existingRows);
  };

  const saveItem = () => {
    // Validate rows before saving
    const invalidRows = rows.filter(
      (row) =>
        !row.MONTH ||
        !row.FINE_PERCENTAGE ||
        Number.parseInt(row.MONTH, 10) < 1 ||
        Number.parseInt(row.MONTH, 10) > 12
    );

    if (invalidRows.length > 0) {
      toast.error(
        "Please fill all required fields correctly. Month must be between 1 and 12."
      );
      return;
    }

    const copyArray = [...fineData];

    // Create a display string for the data field in the main table
    const monthsString = rows.map((row) => `Month: ${row.MONTH}`).join(", ");

    copyArray[0].fine_master = rows;
    copyArray[0].displayString = monthsString; // Add this line to store the display string

    setFineData(copyArray);
    handleClose();
  };

  const SaveData = () => {
    const currentFine = fineData[0];
    console.log(currentFine);

    if (!currentFine.CODE) {
      toast.error("Please enter a Code.");
      return;
    }

    if (!currentFine.fine_master || currentFine.fine_master.length === 0) {
      toast.error("Please add at least one fine detail.");
      return;
    }

    // Check if all required fields in the nested data are filled
    const invalidDetails = currentFine.fine_master.filter(
      (detail) => !detail.MONTH || !detail.FINE_PERCENTAGE
    );

    if (invalidDetails.length > 0) {
      toast.error("Please fill all required fields in fine details.");
      return;
    }

    // Submit the data
    FineAdd(currentFine);
  };

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (FineAddSuccess) {
      toast.success("Fine Added Successfully");
      setFineData([
        {
          id: 1,
          CompanyID: CompanyID,
          CODE: null,
          DESCRIPTION: null, // Reset DESCRIPTION field
          displayString: "", // Add this line
          fine_master: [
            {
              MONTH: "",
              FINE_PERCENTAGE: "",
            },
          ],
        },
      ]);
      setRows([
        {
          rowid: 1,
          MONTH: "",
          FINE_PERCENTAGE: "",
        },
      ]);
    }

    if (FineAddError) toast.error(FineAddError);

    ClearStateFineAdd();
  }, [FineAddSuccess, FineAddError, CompanyID, ClearStateFineAdd]);

  return (
    <Container fluid style={{ width: "98%", padding: 0 }}>
      <ToastContainer />
      <Row style={{ marginTop: "60px", marginLeft: "3px", width: "100%" }}>
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <h5>Fine Management</h5>
          </div>
          <hr className="mt-1 mb-2" />
        </Col>

        <Col xs={12} sm={12} md={11} lg={10} xl={10}>
          <EstimateTable
            columns={columns}
            rows={fineData}
            handleChange={onChangeHandler}
            SearchHandler={handleOpen}
            priorityref={inputRef1}
          />
          <ReusableModal
            show={showModal}
            Title={"Fine Details"}
            isPrimary={true}
            isSuccess={true}
            handleClose={handleClose}
            handlePrimary={saveItem}
            handleSuccess={addRow}
            SuccessButtonName={"Add Row"}
            PrimaryButtonName={"Save"}
            key={4}
            body={
              <div>
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
            }
          />
        </Col>
        <Col xs={12} sm={12} md={1} lg={2} xl={2}>
          <div className="d-flex justify-content-start mt-3">
            <Button
              variant="success"
              onClick={SaveData}
              disabled={isFineAddLoading}
            >
              {isFineAddLoading ? "Processing..." : "Add Fine"}
            </Button>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="my-1" />
          <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
            <div>
              <label
                className="form-input"
                style={{
                  width: "28vw",
                  border: "1px solid dodgerblue",
                  borderRadius: "5px",
                  padding: "5px",
                  outline: "1px solid dodgerblue",
                  display: "flex",
                  alignItems: "center",
                  // borderColor: "#25a353",
                }}
              >
                <i
                  className="bi bi-search"
                  style={{
                    fontSize: "16px",
                  }}
                ></i>
                <input
                  value={searchData}
                  type="search"
                  placeholder="Search here....."
                  style={{
                    width: "80%",
                    border: "none",
                    outline: "none",
                    padding: "0px 5px",
                  }}
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </label>
            </div>
          </div>
          <hr className="my-1" />
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <hr className="mt-3 mb-2" />
          <h5>Existing Fines</h5>
          <hr className="my-2" />
          <FineTable
            isDisable={isDisable}
            setIsDisable={setIsDisable}
            search={searchData}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default FineListEdit;
