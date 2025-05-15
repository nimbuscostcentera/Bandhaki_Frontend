import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Row, Col, Form, Container, InputGroup, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWS from "../../store/ShowStore/useFetchWS";
import SelectOption from "../../Component/SelectOption";
import SearchableDropDown from "../../Component/SearchableDropDown/index";
import useFetchDueRcvWh from "../../store/ShowStore/useFetchDueRcvWh"; // New hook for credit amounts
import InputBox from "../../Component/InputBox";
import useAddDueRcvWh from "../../store/AddStore/useAddDueRcvWh";

function DueRecWholesaler() {
  // State hooks
  const [inputAmounts, setInputAmounts] = useState({});
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const entityType = 2; // Hardcoded as wholesaler type

  const [filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
  });

  const [wholeseller, setWholeseller] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState(-1);
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState({
    View1: false,
    View2: false,
  });

  // API hooks
  // const { user } = useFetchAuth();
  const { WholeSellerList, fetchWSomrData } = useFetchWS();
  // API hooks
  const { user } = useFetchAuth();
  const {
    DueRcvwhList,
    isDueRcvwhListLoading,
    isDueRcvwhListError,
    ClearstateDueRcvwhList,
    searchDueRcvwhHeader,
    DueRcvwhErrMsg,
  } = useFetchDueRcvWh();
  const {
    ClearStateDueRcvWhAdd,
    DueRcvWhAdd,
    DueRcvWhAddError,
    isDueRcvWhAddLoading,
    DueRcvWhAddSuccess,
  } = useAddDueRcvWh();

  // Handlers
  const handleSave = async (wholesalerId, dueAmount) => {
    const amount = inputAmounts[wholesalerId]?.amount;
    const mode = inputAmounts[wholesalerId]?.mode;
    console.log(amount,"amount", mode, "Mode");
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > dueAmount) {
      toast.error("Amount cannot exceed due amount");
      return;
    }

    setSaving(true);
    try {
      // API call to save payment

      DueRcvWhAdd({
        WholesalerID: wholesalerId,
        Amount: amount,
        DueAmount: filteredData[0]?.DueAmount,
        Cust_Type: 2,
        mode : mode || 1,
      });
      // Refresh data after successful save
      performSearch(); 
      // toast.success("Payment saved successfully");
      setInputAmounts((prev) => ({ ...prev, [wholesalerId]: "" }));
    } catch (error) {
      toast.error("Failed to save payment");
    } finally {
      setSaving(false);
    }
  };

  const handleWholesalerChange = (e) => {
    const value = e.target.value;
    setSelectedEntityId(value);
    performSearch();
  };

  const performSearch = () => {
    searchDueRcvwhHeader({
      keyword: searchTerm.trim(),
      WholesalerId: selectedEntityId !== -1 ? selectedEntityId : null,
      Cust_Type: entityType,
      StartDate: filters?.StartDate,
      EndDate: filters?.EndDate,
      CompanyID: user?.CompanyID,
    });
  };

  // Calendar handlers

  // Effects
  useEffect(() => {
    if (
      searchTerm === "" &&
      selectedEntityId === -1 &&
      !filters.StartDate &&
      !filters.EndDate
    ) {
      setFilteredData(null);
    }

    const debounceTimer = setTimeout(() => {
      if (
        searchTerm.trim() ||
        selectedEntityId !== -1 ||
        filters.StartDate ||
        filters.EndDate
      ) {
        performSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedEntityId, filters, DueRcvWhAddSuccess]);

  useEffect(() => {
    fetchWSomrData({ CompanyID: user?.CompanyID });
  }, [user?.CompanyID]);

  useEffect(() => {
    if (WholeSellerList?.length > 0) {
      const formattedWholesellers = WholeSellerList.map((wholeseller) => ({
        label: wholeseller.Name,
        value: wholeseller.ID,
      }));
      setWholeseller(formattedWholesellers);
    }
  }, [WholeSellerList]);

  useEffect(() => {
    if (isDueRcvwhListError) {
      toast.error(DueRcvwhErrMsg, { position: "top-right", autoClose: 3000 });
      setFilteredData(null);
    } else if (DueRcvwhList) {
      setFilteredData(DueRcvwhList);
    }
  }, [DueRcvwhList, isDueRcvwhListError, DueRcvWhAddSuccess]);

  useEffect(() => {
    return () => {
      setFilteredData(null);
      setSearchTerm("");
      ClearstateDueRcvwhList();
    };
  }, []);


    useEffect(() => {
      if (DueRcvWhAddError) {
        toast.error(DueRcvWhAddError,{position:"top-right",autoClose:3000});
      }
      if (DueRcvWhAddSuccess) {
        toast.success("Payment saved successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      ClearStateDueRcvWhAdd();
    },[DueRcvWhAddError,DueRcvWhAddSuccess]);
  const renderTable = () => (
    <div
      className="table-box"
      style={{
        height: "55vh",
        border: "1px solid lightgrey",
        overflow: "auto",
      }}
    >
      {isDueRcvwhListLoading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredData.length > 0 && filteredData[0]?.DueAmount != 0 ? (
        <table
          style={{
            width: "100%",
            overflow: "auto",
          }}
        >
          <thead className="tab-head">
            <tr className="table-secondary">
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Sl No.
              </th>
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Wholesaler Name
              </th>
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Due Amount (₹)
              </th>
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Payment Amount (₹)
              </th>
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Payment Mode
              </th>
              <th scope="col" style={{ padding: "7px", minWidth: "20px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="tab-body">
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.WholesalerName}</td>
                <td>₹{item.DueAmount?.toFixed(2)}</td>
                <td>
                  <InputBox
                    type="text"
                    placeholder="Enter amount"
                    label="paymentAmount"
                    Name="paymentAmount"
                    onChange={(e) =>
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          amount: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    value={inputAmounts[item.WholesalerID]?.amount || ""}
                    InputStyle={{ padding: "6px 8px", width: "70%" }}
                    Icon={<i className="bi bi-cash"></i>}
                  />
                </td>

                <td>
                  <SelectOption
                    OnSelect={(e) => {
                      const selectedValue = parseInt(e.target.value);
                      setInputAmounts((prev) => ({
                        ...prev,
                        [item.WholesalerID]: {
                          ...prev[item.WholesalerID],
                          mode: selectedValue,
                        },
                      }));
                    }}
                    PlaceHolder={"Select Payment Mode"}
                    SName={"mode"}
                    SelectStyle={{ width: "100%", padding: "5px 10px" }}
                    Value={inputAmounts[item.WholesalerID]?.mode || ""}
                    Soptions={[
                      { Name: "Cash", Value: 1 },
                      { Name: "UPI", Value: 2 },
                      { Name: "Bank Transfer", Value: 3 },
                    ]}
                  />
                </td>

                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() =>
                      handleSave(item.WholesalerID, item.DueAmount)
                    }
                    disabled={saving || !inputAmounts[item.WholesalerID]}
                  >
                    <i className="bi bi-save me-1"></i>
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-muted py-3">No records found.</div>
      )}
    </div>
  );

  return (
    <Container fluid className="pt-5">
      <ToastContainer />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h5 className="mt-2" style={{ fontSize: "18px" }}>
                Due Receive For Wholesaler
              </h5>
            </div>
            <div className="d-flex justify-content-between flex-wrap align-items-end gap-2">
              <div style={{ width: "300px" }}>
                <SearchableDropDown
                  options={wholeseller}
                  handleChange={handleWholesalerChange}
                  selectedVal={selectedEntityId}
                  label={"selectedEntityId"}
                  placeholder="--Select Wholeseller--"
                  defaultval={-1}
                  width={"100%"}
                />
              </div>
            </div>
          </div>
          <hr className="my-1" />
        </Col>

        <Col xl={12}>
          <div
            className="table-box"
            style={{ height: "55vh", overflow: "auto" }}
          >
            {filteredData?.length > 0 ? (
              renderTable()
            ) : isDueRcvwhListLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                {searchTerm || selectedEntityId !== -1 || filters.StartDate
                  ? "No results found. Try a different search."
                  : "Use the search bar, date picker or select a wholesaler to find entries."}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DueRecWholesaler;
