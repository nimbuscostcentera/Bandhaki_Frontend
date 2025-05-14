import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import useFetchTiming from "../../store/ShowStore/useFetchTiming";
import useEditTiming from "../../store/UpdateStore/useEditTiming";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function TimingTable() {
  const [localData, setLocalData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [masterToggle, setMasterToggle] = useState(false);

  const {
    TimingList,
    fetchTimingMaster,
    isTimingLoading,
    ClearTimingList,
    TimingError,
  } = useFetchTiming();

  const {
    EditTimingFunc,
    TimingEditError,
    isTimingEditLoading,
    TimingEditSuccess,
    ClearStateEditTiming,
  } = useEditTiming();

  // Initialize local data when fetched data changes
  useEffect(() => {
    if (TimingList.length > 0) {
      setLocalData(TimingList.map((item) => ({ ...item })));
    }
  }, [TimingList]);

  useEffect(() => {
    fetchTimingMaster({});
  }, [TimingEditSuccess]);

  const handleCheckboxChange = (rowId, fieldName, value) => {
    const newValue = value ? 1 : 0;

    // Update local data
    const updatedData = localData.map((item) =>
      item.id === rowId ? { ...item, [fieldName]: newValue } : item
    );

    setLocalData(updatedData);

    // Track edited fields
    setEditedData((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [fieldName]: newValue,
      },
    }));

    // Add to changed rows
    setSelectedRows((prev) => new Set([...prev, rowId]));
  };

  const handleMasterToggle = () => {
    const newToggleState = !masterToggle;
    const updates = {};

    const updatedData = localData.map((item) => {
      const updatedItem = {
        ...item,
        Date_To_Date: newToggleState ? 1 : 0,
        Monthly: newToggleState ? 1 : 0,
        First_Day_Of_Month: newToggleState ? 1 : 0,
      };
      updates[item.id] = updatedItem;
      return updatedItem;
    });

    setLocalData(updatedData);
    setEditedData(updates);
    setMasterToggle(newToggleState);
    setSelectedRows(new Set(localData.map((item) => item.id)));
  };

  const handleSave = async () => {
    if (selectedRows.size === 0) {
      toast.error("No changes to save");
      return;
    }

    // Prepare changes payload
    const changes = Array.from(selectedRows).map((rowId) => ({
      id: rowId,
      ...editedData[rowId],
    }));
    console.log(changes, "changes");
    try {
      await EditTimingFunc({ changes });

      // Refresh data after successful save
      // await fetchTimingMaster({});

      // Reset states
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  // Handle API response states
  useEffect(() => {
    if (TimingEditSuccess) {
      toast.success("Changes saved successfully");
      setSelectedRows(new Set());
      setEditedData({});
      setMasterToggle(false);
    }
    if (TimingEditError) {
      toast.error(TimingEditError);
    }
    ClearStateEditTiming();
  }, [TimingEditSuccess, TimingEditError]);
  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <h5 className="my-1 mx-1 p-0">Timing Table</h5>
          <hr />
        </Col>

        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="table-responsive">
            <table hover className="mb-0" style={{ width: "100%" }}>
              <thead
                className="tab-head"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2, // Ensure background isn't transparent
                }}
              >
                <tr>
                  <th>TRANCODE</th>
                  <th>Cust Type</th>
                  <th style={{ backgroundColor: "#ffff00" }}>Date to Date</th>
                  <th style={{ backgroundColor: "#00ffff" }}>Monthly</th>
                  <th style={{ backgroundColor: "#00ffff" }}>
                    First Day of Month
                  </th>
                </tr>
              </thead>
              <tbody
                className="tab-body"
                style={{
                  overflowY: "auto",
                  zIndex: 1,
                }}
              >
                {localData.map((item) => (
                  <tr key={item.id} style={{ backgroundColor: "#ffffff" }}>
                    <td>{item.TRANCODE || "-"}</td>
                    <td>{item.Person}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={
                          editedData[item.id]?.Date_To_Date ?? item.Date_To_Date
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item.id,
                            "Date_To_Date",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={editedData[item.id]?.Monthly ?? item.Monthly}
                        onChange={(e) =>
                          handleCheckboxChange(
                            item.id,
                            "Monthly",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={
                          editedData[item.id]?.First_Day_Of_Month ??
                          item.First_Day_Of_Month
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item.id,
                            "First_Day_Of_Month",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex justify-content-end align-items-center my-2 mx-4">
            <div className="d-flex align-items-center mx-4 my-2">
              <span className="me-2">Check All:</span>
              <Form.Check
                type="checkbox"
                checked={masterToggle}
                onChange={handleMasterToggle}
              />
            </div>
            <div className="mx-4 my-2">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isTimingEditLoading}
                style={{
                  padding: "3px 10px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {isTimingEditLoading ? "Saving..." : "Save"}
              </Button>{" "}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TimingTable;
