import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import useFetchAdminSetUp from "../../store/ShowStore/useFetchAdminSetUp";
import useEditTiming from "../../store/UpdateStore/useEditTiming";
import { toast } from "react-toastify";
import useEditCredit from "../../store/UpdateStore/useEditCredit";
import { ToastContainer } from "react-toastify";
import InputBox from "../../Component/InputBox";
import Initialization from "../Initialization";
function CreditSetUp() {
  const [localData, setLocalData] = useState([
    {
      Customer_Access: null,
      WholeSaler_Access: null,
      Mahajan_Access: null,
    },
  ]);
  const [editedData, setEditedData] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [masterToggle, setMasterToggle] = useState(false);

  const {
    AdminSetUp,
    isLoadingAdminSetUp,
    errorAdminSetUp,
    ClearAdminSetUp,
    fetchAdminSetUp,
  } = useFetchAdminSetUp();

  const {
    EditCreditFunc,
    CreditEditError,
    isCreditEditLoading,
    CreditEditSuccess,
    ClearStateEditCredit,
  } = useEditCredit();

  const handleCheckboxChange = (rowId, fieldName, value) => {
    const newValue = value ? 1 : 0;

    // Update local data
    const updatedData = localData.map((item) =>
      item.ID === rowId ? { ...item, [fieldName]: newValue } : item
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
  const handleInputChange = (ID,name,newValue) => {
    const updatedData = localData.map((item) =>
      item.ID === ID ? { ...item, [name]: newValue } : item
    );
    setLocalData(updatedData);
    // Track edited fields
    setEditedData((prev) => ({
      ...prev,
      [ID]: {
        ...prev[ID],
        [name]: newValue,
      },
    }));
    setSelectedRows((prev) => new Set([...prev, ID]));
  }
  const handleMasterToggle = () => {
    const newToggleState = !masterToggle;
    const updates = {};

    const updatedData = localData.map((item) => {
      const updatedItem = {
        ...item,
        Customer_Access: newToggleState ? 1 : 0,
        WholeSaler_Access: newToggleState ? 1 : 0,
        Mahajan_Access: newToggleState ? 1 : 0,
      };
      updates[item.ID] = updatedItem;
      return updatedItem;
    });

    setLocalData(updatedData);
    setEditedData(updates);
    setMasterToggle(newToggleState);
    setSelectedRows(new Set(localData.map((item) => item.ID)));
  };

  const handleSave = async () => {
    if (selectedRows.size === 0) {
      toast.error("No changes to save");
      return;
    }

    // Prepare changes payload
    const changes = Array.from(selectedRows).map((rowId) => ({
      ID: rowId,
      ...editedData[rowId],
    }));
    // console.log(changes, "changes");
    try {
      await EditCreditFunc({ changes });
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  // Handle API response states
  useEffect(() => {
    if (CreditEditSuccess) {
      // ClearStateEditCredit();
      toast.success("Changes saved successfully");
      // Reset states
      setSelectedRows(new Set());
      setEditedData({});
      setMasterToggle(false);
    }
    if (CreditEditError) {
      toast.error(CreditEditError);
    }
    ClearStateEditCredit();
  }, [CreditEditSuccess, CreditEditError]);
  // Initialize local data when fetched data changes
  useEffect(() => {
    if (AdminSetUp?.length > 0) {
      setLocalData(AdminSetUp.map((item) => ({ ...item })));
    }
  }, [AdminSetUp]);

  useEffect(() => {
    fetchAdminSetUp({});
  }, [CreditEditSuccess]);

  return (
    <Container fluid className="pt-5">
      {/* <ToastContainer /> */}
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <h5 className="my-1 mx-1 p-0">Setup Master</h5>
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
                  <th>Access</th>
                  <th>Customer</th>
                  <th>Wholesaler</th>
                  <th>Mahajan</th>
                  <th>Days</th>
                  {/* <th style={{ backgroundColor: "#ffff00" }}>Date to Date</th>
                  <th style={{ backgroundColor: "#00ffff" }}>Monthly</th>
                  <th style={{ backgroundColor: "#00ffff" }}>
                    First Day of Month
                  </th> */}
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
                  <tr key={item.ID} style={{ backgroundColor: "#ffffff" }}>
                    <td>{item?.Field_Name || "-"}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={
                          editedData[item.ID]?.Customer_Access ??
                          item?.Customer_Access
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item?.ID,
                            "Customer_Access",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={
                          editedData[item.ID]?.WholeSaler_Access ??
                          item.WholeSaler_Access
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item.ID,
                            "WholeSaler_Access",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={
                          editedData[item.ID]?.Mahajan_Access ??
                          item?.Mahajan_Access
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item?.ID,
                            "Mahajan_Access",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td style={{ width: "200px" }}>
                      <InputBox
                        label={"Days"}
                        Name={"Days"}
                        isdisable={item?.Field_Name == "CREDIT"}
                        isfrontIconOff={true}
                        placeholder={item?.Field_Name == "CREDIT"?"":"Enter Days"}
                        type="number"
                        value={item?.Days ||""}
                        onChange={(e) =>
                          handleInputChange(item.ID, "Days", e.target.value)
                        }
                        InputStyle={{
                          width: "100%",
                          padding: "1px 5px",
                          border: "none",
                          textAlign: "center",
                        }}
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
                disabled={isCreditEditLoading}
                style={{
                  padding: "3px 10px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {isCreditEditLoading ? "Saving..." : "Save"}
              </Button>{" "}
            </div>
          </div>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex justify-content-end align-items-center">
            <Initialization/>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CreditSetUp;
