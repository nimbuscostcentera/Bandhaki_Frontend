"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";

import Table from "../../Component/Table";
import ReusableModal from "../../Component/ReusableModal";
import BongDatePicker from "../../Component/BongDatePicker";

import useFetchWS from "../../store/ShowStore/useFetchWS";
import useFetchCustomer from "../../store/ShowStore/useFetchCust";
import useFetchMahajon from "../../store/ShowStore/useFetchMahajon";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchSearchDafa from "../../store/ShowStore/useFetchSearchDafa";
import SearchableDropDown from "../../Component/SearchableDropDown";
import useAddSearch from "../../store/AddStore/useAddSearch";
import getPrintDafa from "./PrintDafa";
import useFetchAdjustIdWithCredit from "../../store/ShowStore/useFetchAdjustIdWithCredit";
function SearchDafa() {
  const { user, CompanyID } = useFetchAuth();
  //-----------------------------------hooks-----------------------------------//
  const [searchParams] = useSearchParams();
  const trancode = searchParams.get("trancode").toString().split(",");
  const entityType =
    searchParams.get("type") === "customer"
      ? 1
      : searchParams.get("type") === "wholesaler"
      ? 2
      : 3;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const editinputref = useRef(null);
  //------------------------------------useStatehook---------------------------------//
  const [filteredData, setFilteredData] = useState([]);

  const [selectedData, setSelectedData] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSelectedModal, setShowSelectedModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    ActionID: null,
    IsAction: false,
    keyword: "",
    searchKeyword: "",
    view: false,
    Lotno: null,
    CustomerID: -1,
    StartDate: null,
    EndDate: null,
    view1: false,
    view2: false,
  });
  const [custList, setCustList] = useState([]);
  const [textDetail, setTextDetail] = useState("");
  //---------------------------------------------API Call------------------------------------//
  // console.log(filteredData, "filtereddata");

  const {
    WholeSellerList,
    isLoadingWSList,
    errorWSList,
    ClearWSList,
    fetchWSomrData,
    isWsSuccess,
  } = useFetchWS();
  const {
    CustomerList,
    fetchCustomrData,
    errorCustList,
    isLoadingCustList,
    ClearStateCust,
    isCustSuccess,
  } = useFetchCustomer();
  const {
    MahajonList,
    isLoadingMahajon,
    errorMahajon,
    ClearMahajonList,
    fetchMahajonData,
    isMJSuccess,
  } = useFetchMahajon();

  const {
    ClearStateSearchDafa,
    fetchSearchDafaMaster,
    SearchDafaError,
    isSearchDafaLoading,
    SearchDafaList,
    isSearchDafaSuccess,
  } = useFetchSearchDafa();
  const {
    ClearStateAddSearch,
    InsertSearch,
    AddSearchError,
    isAddSearchLoading,
    AddSearchSuccess,
  } = useAddSearch();

  //---------------------------------------functions------------------------------------//
  const handleDeleteClick = (index) => {
    const deleteobj = filteredData[index];
    // Immediately set the item to delete
    setItemToDelete(deleteobj);
  };

  // console.log(SearchDafaList, "SearchDafaList");

  const handleCheckChange = (item, isChecked) => {
    if (isChecked) {
      // Add the item if it's not already selected (check LotNo + SRL combo)
      const exists = selectedRows.some(
        (row) => row.LotNo === item.LotNo && row.SRL === item.SRL
      );

      if (!exists) {
        if (selectedRows.length > 0) {
          const sameCustomer = selectedRows.every(
            (i) => i.CustomerID === item.CustomerID
          );

          if (!sameCustomer) {
            toast.dismiss();
            toast.error("You can only select items from the same customer!");
            return;
          }
        }

        setSelectedRows((prev) => [...prev, item]);
        setCheckedIds((prev) => [
          ...prev,
          { LotNo: item.LotNo, SRL: item.SRL },
        ]);
      }
    } else {
      // Remove the item when unchecked
      setSelectedRows((prev) =>
        prev.filter((row) => row.LotNo !== item.LotNo || row.SRL !== item.SRL)
      );
      setCheckedIds((prev) =>
        prev.filter((i) => i.LotNo !== item.LotNo || i.SRL !== item.SRL)
      );
    }
  };

  const handleSelectedRowsModal = () => {
    setShowSelectedModal(true);
  };

  const handleCloseSelectedModal = () => {
    setShowSelectedModal(false);
  };
  const saveItem = () => {
    // console.log("save item")
    // console.log(selectedRows);

    if (selectedRows.length > 0) {
      // setSelectedData(selectedRows);
      InsertSearch({
        CompanyID: user?.CompanyID,
        Cust_Type: entityType,
        searchData: selectedRows,
      });
      // setShowSelectedModal(false);
    }
  };

  const OnChangeHandler = (index, e) => {
    const key = e.target.name;
    const value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setParams((prev) => ({ ...prev, page: newPage }));
  //   }
  // };

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

  const FetchActionId = (index) => {
    // setParams((prev) => ({ ...prev, SelectedID: index, isAction: true }));
    const editableobj = filteredData[index];
    // CheckOpeningHeader({
    //   ID: editableobj.ID,
    //   Cust_Type: entityType,
    //   TranCode: trancode,
    // });
    setSelectedId(index);

    // Find the warehouse ID based on the warehouse code
    // const selectedWarehouse = WareHouseList.find(
    //   (warehouse) => warehouse.CODE === editableobj.WarehouseCode
    // );

    // Create the edited data object with only the editable fields
    const obj = {
      ID: editableobj.ID,
      // WarehouseID: selectedWarehouse ? selectedWarehouse.ID : "", // Use ID property, not the whole object
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

  const SaveHandler = (index) => {
    // console.log({ ...editedData, LotNo: lotno });
    // EditOpeningHeaderFunc({
    //   ID: editedData.ID,
    //   PacketNo: editedData.PacketNo,
    //   WarehouseID: editedData.WarehouseID,
    //   Cust_Type: entityType,
    //   TranCode: trancode,
    // });
  };

  const handlePrintDafa = () => {
    // console.log(selectedRows, "here print");
    // setSelectedRows((prev) => {
    //   return prev.map((item) => {
    //     return {
    //       ...item,
    //       Lot_date: `${item.LotNo}-${item.EntryDate}`,
    //     };
    //   });
    // })

    const changedarray = selectedRows.map((item) => {
      return {
        ...item,
        Lot_date: `${item.LotNo}-${item.EntryDate}`,
      };
    });
    // console.log(changedarray, "changedarray");
    getPrintDafa(changedarray, entityType);
  };

  const handleCloseDatePicker = () => {
    // setParams({ ...params,  });
    setParams((prev) => ({ ...prev, view1: false, view2: false }));
  };

  const StartDatePickerOpen = () => {
    setParams({ ...params, view1: true });
  };

  const EndDatePickerOpen = () => {
    setParams({ ...params, view2: true });
  };

  const handleDatePicker = (value, name) => {
    let key = name;
    const val = value;
    console.log(value, name, "in");
    if (key === "StartDate") {
      key = "StartDate";
    } else if (key === "EndDate") {
      key = "EndDate";
    }
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  // Handle search input with debounce
  useEffect(() => {
    if (CompanyID && entityType && trancode) {
      if (
        (params?.StartDate && !params?.EndDate) ||
        (!params?.StartDate && params?.EndDate)
      ) {
        return;
      } else if (
        params?.CustomerID !== "" &&
        params?.CustomerID !== -1 &&
        params?.CustomerID !== 0 &&
        params?.CustomerID !== undefined &&
        params?.CustomerID !== null
      ) {
        fetchSearchDafaMaster({
          TranCode: trancode,
          Cust_ID: params?.CustomerID,
          StartDate: params?.StartDate,
          EndDate: params?.EndDate,
          CompanyID: user?.CompanyID,
          Cust_Type: entityType,
          keyword: params?.keyword,
        });
      }
    }
  }, [params?.StartDate, params?.EndDate, params?.CustomerID, params?.keyword]);

  // Initial data load
  useEffect(() => {
    if (user?.CompanyID && trancode && entityType) {
      if (
        (params?.StartDate && !params?.EndDate) ||
        (!params?.StartDate && params?.EndDate)
      ) {
        return;
      } else {
        if (entityType == 1) {
          fetchCustomrData({
            CompanyID: user?.CompanyID,
            Cust_Type: entityType,
            TranCode: trancode,
          });
        } else if (entityType == 2) {
          fetchWSomrData({
            CompanyID: user?.CompanyID,
            Cust_Type: entityType,
            TranCode: trancode,
          });
        } else if (entityType == 3) {
          fetchMahajonData({
            CompanyID: user?.CompanyID,
            Cust_Type: entityType,
            TranCode: trancode,
          });
        }
      }
    }
  }, [entityType]);
  //load type usestate hook when response come
  useEffect(() => {
    if (isCustSuccess && entityType == 1) {
      const obj = {
        label: "--Select Customer--",
        value: -1,
      };
      let arr = [{ ...obj }];
      const list = CustomerList?.map((item) => {
        const obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      // console.log(arr);
      setCustList(arr);
      ClearStateCust();
    } else if (isMJSuccess && entityType == 3) {
      const obj = {
        label: "--Select Mahajon--",
        value: -1,
      };
      let arr = [{ ...obj }];
      const list = MahajonList?.map((item) => {
        const obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      setCustList(arr);
      ClearMahajonList();
    } else if (isWsSuccess && entityType == 2) {
      const obj = {
        label: "--Select WholeSaler--",
        value: -1,
      };
      let arr = [obj];
      const list = WholeSellerList?.map((item) => {
        let obj = {};
        obj.label = item?.Name;
        obj.value = item?.ID;
        return obj;
      });
      arr = [...arr, ...list];
      setCustList(arr);
      ClearWSList();
    }
  }, [entityType, trancode, isCustSuccess, isMJSuccess, isWsSuccess]);

  // Update filtered data when EntryList changes
  useEffect(() => {
    // Clear data on error
    if (SearchDafaError) {
      setOriginalOrder([]);
      setFilteredData([]);
      return;
    }

    // Handle successful response
    if (isSearchDafaSuccess) {
      if (SearchDafaList && SearchDafaList.length > 0) {
        const newOriginalOrder = SearchDafaList.map((item) => item.ID);
        setOriginalOrder(newOriginalOrder);
        setFilteredData(SearchDafaList);
      } else {
        setOriginalOrder([]);
        setFilteredData([]);
      }
    }
  }, [isSearchDafaSuccess, SearchDafaList, SearchDafaError]);

  useEffect(() => {
    return () => {
      setSearchTerm("");
      setTextDetail("");
      setParams({
        ActionID: null,
        IsAction: false,
        view: false,
        Lotno: null,
        Status: 2,
        StartDate: null,
        EndDate: null,
        view1: false,
        view2: false,
      });
      setSelectedRows([]);
      setCheckedIds([]);
      setShowSelectedModal(false);
      ClearStateAddSearch();
      ClearStateSearchDafa();
      ClearStateCust();
      setOriginalOrder([]);
      setFilteredData([]);
    };
  }, [entityType]);

  // Add this useEffect for handling API responses
  useEffect(() => {
    if (AddSearchSuccess) {
      toast.success("Data saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Clear selected state on success
      setSelectedRows([]);
      setCheckedIds([]);
      setShowSelectedModal(false);
      ClearStateAddSearch();
    }

    if (AddSearchError) {
      toast.error(AddSearchError, {
        position: "top-right",
        autoClose: 3000,
      });
      ClearStateAddSearch();
    }
  }, [AddSearchSuccess, AddSearchError]);

  //----------------------------------------------const & var-----------------------------------------//

  const columns = [
    {
      headername: "EntryDate",
      fieldname: "EntryDate",
      type: "BongDate",
      width: "90px",
    },
    {
      headername: "LotNo",
      fieldname: "LotNo",
      type: "String",
      isNotEditable: true,
      // width: "70px",
    },
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "String",
      isNotEditable: true,
      width: "70px",
    },
    {
      headername:
        entityType == 1
          ? "Cust. Name"
          : entityType == 2
          ? "Wh. Name"
          : "Mh. Name",
      fieldname: "CustomerName",
      type: "String",
      isNotEditable: true,
      // width: "70px",
    },
    {
      headername: "WareHouseName",
      fieldname: "WareHouseName",
      type: "String",
      isNotEditable: true,
      // width: "70px",
    },
    {
      headername: "Mh. Name",
      fieldname: "MahajanName",
      type: "String",
      isNotEditable: true,
      // width: "70px",
    },

    {
      headername: "Description",
      fieldname: "Description",
      type: "String",
      isNotEditable: true,
      width: "200px",
    },

    {
      headername: "Prn Amt.",
      fieldname: "Update_Prn_Rcv",
      type: "String",
      isNotEditable: true,
      width: "100px",
    },
  ];

  return (
    <Container fluid className="pt-5">
      <ToastContainer autoClose={3000} />
      <Row className="pt-2">
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <h5 style={{ marginBottom: 0 }}>
                Search All Dafa of
                {entityType == 1
                  ? " Customer"
                  : entityType == 2
                  ? " Wholesaler"
                  : "Mahajon"}
              </h5>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
              <BongDatePicker
                startDate={params?.StartDate}
                endDate={params?.EndDate}
                handleChange={(e, name) => handleDatePicker(e, name)}
                handleClose={handleCloseDatePicker}
                handleOpenEndDate={EndDatePickerOpen}
                handleOpenStartDate={StartDatePickerOpen}
                view1={params?.view1}
                view2={params?.view2}
              />
            </div>
          </div>

          <hr className="my-2" />
        </Col>

        <Col xl={4} lg={4} md={4} sm={12} xs={12} className="my-1">
          <input
            placeholder="Description search..."
            style={{
              width: "100%",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              padding: "5px 8px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#212529",
              transition: "all 0.3s ease",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              // Focus state
              ":focus": {
                borderColor: "#3b7ddd",
                boxShadow: "0 0 0 3px rgba(59, 125, 221, 0.25)",
                backgroundColor: "#f8fbff",
              },
            }}
            value={params?.keyword}
            onChange={(e) =>
              setParams((params) => ({ ...params, keyword: e.target.value }))
            }
          />
        </Col>
        <Col xl={4} lg={4} md={4} sm={6} xs={12} className="my-1">
          <input
            placeholder="Search here..."
            style={{
              width: "100%",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              padding: "5px 8px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#212529",
              transition: "all 0.3s ease",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              "::placeholder": {
                color: "#868e96",
                opacity: " 1",
                fontWeight: "300",
              },
              // Focus state
              ":focus": {
                borderColor: "#3b7ddd",
                boxShadow: "0 0 0 3px rgba(59, 125, 221, 0.25)",
                backgroundColor: "#f8fbff",
              },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xl={4} lg={4} md={4} sm={6} xs={12} className="my-1">
          <div style={{ width: "100%" }}>
            <SearchableDropDown
              options={custList}
              handleChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  CustomerID: e?.target?.value,
                }))
              }
              SelectStyle={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
              selectedVal={params?.CustomerID || ""}
              label={"CustomerID"}
              placeholder={`--Select ${
                entityType == 1
                  ? " Customer"
                  : entityType == 2
                  ? " Wholesaler"
                  : "Mahajon"
              } --`}
              key={2}
              defaultval={-1}
            />
          </div>
        </Col>

        <Col xl={12} lg={12} md={12} sm={12} xs={12} className="my-1">
          <textarea
            value={textDetail}
            readOnly
            type="search"
            rows={2}
            placeholder="Detail View"
            style={{
              width: "100%",
              border: "1px solid #ced4da",
              borderRadius: "8px",
              padding: "5px 8px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#212529",
              transition: "all 0.3s ease",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              "::placeholder": {
                color: "#868e96",
                opacity: " 1",
                fontWeight: "300",
              },
              // Focus state
              ":focus": {
                borderColor: "#3b7ddd",
                boxShadow: "0 0 0 3px rgba(59, 125, 221, 0.25)",
                backgroundColor: "#f8fbff",
              },
            }}
          ></textarea>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div className="table-box my-2">
            {filteredData?.length > 0 ? (
              <Table
                Col={columns}
                tab={filteredData || []}
                isCheck={true}
                height={"80vh"}
                // isLoading={isEntryListLoading}
                onSorting={SortingFunc}
                OnChangeHandler={OnChangeHandler}
                // ActionId={params?.SelectedID}
                ActionId={params?.ActionID}
                ActionFunc={FetchActionId}
                onCheckChange={handleCheckChange}
                checkedIds={checkedIds}
                // EditedData={editedData}
                OnSaveHandler={SaveHandler}
                // PageNumber={params?.page}
                // rowsperpage={params?.limit}
                // handleDelete={handleDelete}
                handleDelete={handleDeleteClick}
                useInputRef={editinputref}
                getFocusText={(val) => {
                  setTextDetail(val);
                }}
                showScrollButtons={false}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center border border-secondary border-opacity-25"
                style={{ height: "60vh" }}
              >
                {SearchDafaError ? (
                  <div>{SearchDafaError}</div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                    Use the search bar or date picker to find entries.
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>

        <Col>
          <div className="d-flex justify-content-end align-items-center mb-2">
            {selectedRows.length > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSelectedRowsModal}
                style={{
                  padding: "5px 12px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                Selected Rows ({selectedRows.length})
              </button>
            )}
          </div>
        </Col>
      </Row>

      {/* Selected Rows Modal */}
      <ReusableModal
        show={showSelectedModal}
        handleClose={handleCloseSelectedModal}
        isFullScreen={true}
        body={
          <div className="p-3">
            <div className="table-responsive">
              <table className="table table-striped table-border align-middle">
                <thead>
                  <tr className="table-light">
                    <th>Entry Date</th>
                    <th>Lot No</th>
                    <th>SRL</th>
                    {entityType == 3 ? null : (
                      <>
                        <th>WareHouse</th>
                        <th>Mh. Name</th>
                      </>
                    )}

                    <th>Cust. Name</th>
                    <th>Description</th>
                    <th>Prn Amt.</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRows.map((row, index) => (
                    <tr key={index}>
                      <td className="py-1 px-1" style={{ width: "95px" }}>
                        {row.EntryDate}
                      </td>
                      <td className="py-1 px-1" style={{ width: "120px" }}>
                        {row.LotNo}
                      </td>
                      <td className="py-1 px-1">{row.SRL}</td>
                      {entityType == 3 ? null : (
                        <>
                          <td className="py-1 px-1" style={{ width: "90px" }}>
                            {row.WareHouseName}
                          </td>
                          <td className="py-1 px-1">{row.MahajanName}</td>
                        </>
                      )}

                      <td className="py-1 px-1">{row.CustomerName}</td>
                      <td className="py-1 px-1" style={{ maxWidth: "350px" }}>
                        {row.Description}
                      </td>
                      <td className="py-1 px-1">{row.Update_Prn_Rcv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3
                className="mb-3"
                style={{ fontSize: "12px", fontWeight: "bold" }}
              >
                Selected Rows ({selectedRows.length})
              </h3>
            </div>
          </div>
        }
        Title="Selected Rows Details"
        isSuccess={true}
        SuccessButtonName={"Print Dafa"}
        handleSuccess={handlePrintDafa}
        isPrimary={true}
        handlePrimary={saveItem}
        PrimaryButtonName={
          isAddSearchLoading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </span>
          ) : (
            "Save"
          )
        }
      />
    </Container>
  );
}

export default SearchDafa;
