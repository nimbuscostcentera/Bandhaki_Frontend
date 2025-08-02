import React, { useEffect, useRef } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import { toast } from "react-toastify";
import useFetchCompany from "../../store/ShowStore/useFetchCompany";
import useAddCompany from "../../store/AddStore/useAddCompany";
import useEditCompany from "../../store/UpdateStore/useEditCompany";
import EmailValidation from "../../GlobalFunctions/EmailValidation";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import { Form, Pagination } from "react-bootstrap";

function CompanyTable({ setIsDisable, setTextDetail, search }) {
  const [editedData, setEditedData] = useState({
    companyId: null,
    CompanyName: null,
    ContactNumber: null,
    Email: null,
    Website: null,
    Logo: null,
    DefaultFinePercentage: null,
    GSTIN: null,
    PAN: null,
    Address: null,
  });
  const editinputref = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.companyId]);
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { CompanyRegSuccess } = useAddCompany();
  // Modify useFetchCompany usage
  const {
    isCompanyLoading,
    CompanyList,
    fetchCompany,
    totalPages, // Ensure your store returns this
    currentPage: storeCurrentPage, // Ensure your store returns this
  } = useFetchCompany();
  const {
    EditCompanyFunc,
    CompanyEditError,
    isCompanyEditLoading,
    CompanyEditSuccess,
    ClearStateEditCompany,
  } = useEditCompany();

  const handleSearch = (e) => {
    const value = search.toLowerCase();

    // Extract valid field names from the Col array
    const validFields = Col.map((col) => col.fieldname);

    const filtered = CompanyList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  
  // Fetch company list when new data is added or edited
  useEffect(() => {
    fetchCompany({ page: currentPage, limit });
    // Maintain sorting order after fetching
    if (originalOrder.length > 0 && CompanyList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => CompanyList.find((row) => row.ID === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }
  }, [CompanyRegSuccess, CompanyEditSuccess, currentPage, limit]);



  // Populate filtered data while maintaining order
  useEffect(() => {
    if (CompanyList?.length > 0) {
      let updatedData = CompanyList.map((item) => ({ ...item }));

      if (originalOrder.length > 0) {
        updatedData = originalOrder
          .map((id) => updatedData.find((row) => row.ID === id))
          .filter(Boolean);
      }

      setFilteredData(updatedData);
    }
  }, [CompanyList, isCompanyLoading, CompanyEditSuccess]);

  const Col = [
    {
      headername: "Company Name",
      fieldname: "CompanyName",
      type: "String",
      width: "150px",
      isUseInputRef: true,
    },

    { headername: "GSTIN", fieldname: "GSTIN", type: "String", width: "140px" },
    { headername: "PAN", fieldname: "PAN", type: "String", width: "100px" },
    { headername: "Phone No.", fieldname: "ContactNumber", type: "Number" },
    { headername: "Email", fieldname: "Email", type: "String", width: "160px" },
    {
      headername: "Address",
      fieldname: "Address",
      type: "String",
    },
    {
      headername: "Fine %",
      fieldname: "DefaultFinePercentage",
      type: "Number",
      width: "75px",
    },
    { headername: "Website", fieldname: "Website", type: "link" },
    { headername: "Logo", fieldname: "Logo", type: "Img", width: "80px" },
  ];

  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setIsDisable(true);
    const selectedData = filteredData[tabIndex];
    if (selectedData) {
      setEditedData({
        companyId: selectedData.ID,
        CompanyName: selectedData.CompanyName || "",
        ContactNumber: selectedData.ContactNumber || "",
        Email: selectedData.Email || "",
        Website: selectedData.Website || "",
        Logo: selectedData.Logo || "",
        DefaultFinePercentage: selectedData.DefaultFinePercentage || "",
        GSTIN: selectedData.GSTIN || "",
        PAN: selectedData.PAN || "",
        Address: selectedData.Address || "",
      });
    }
  };

  // const applyFilter = (newFilteredData) => {
  //   setFilteredData(newFilteredData);
  //   setOriginalOrder(newFilteredData.map((row) => row.ID));
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
    } else if (type === "Number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID)); // Store order
  };

  const OnChangeHandler = (index, e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const SaveChange = () => {
    if (!/^\d{10}$/.test(editedData.ContactNumber)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(editedData.ContactNumber)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!EmailValidation(editedData.Email)) {
      toast.error("Invalid Email Id!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    EditCompanyFunc({ ...editedData });
  };

  useEffect(() => {
    // if (isCompanyEditLoading && !CompanyEditSuccess && !CompanyEditError) {
    //   toast.info("Please wait...", { position: "top-right", autoClose: 1000 });
    // } else
    if (CompanyEditSuccess && !isCompanyEditLoading && !CompanyEditError) {
      toast.success("Company Edited Successfully", {
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
      CompanyEditError &&
      !isCompanyEditLoading &&
      !CompanyEditSuccess
    ) {
      toast.error(CompanyEditError, { position: "top-right", autoClose: 3000 });
    }
    ClearStateEditCompany();
  }, [isCompanyEditLoading, CompanyEditSuccess, CompanyEditError]);

  return (
    <div>
      <div className="table-box" style={{ height: "35vh", width: "90%" }}>
        <Table
          tab={filteredData}
          isAction={params?.IsAction}
          ActionFunc={ActionFunc}
          ActionId={params?.ActionID}
          OnChangeHandler={OnChangeHandler}
          OnSaveHandler={SaveChange}
          onSorting={SortingFunc}
          Col={Col}
          isEdit={true}
          EditedData={editedData}
          isLoading={isCompanyLoading}
          useInputRef={editinputref}
          getFocusText={(val) => {
            setTextDetail(val);
          }}
          height={"35vh"}
        />
      </div>
      {/* Pagination Controls */}
      {/* <div className="d-flex justify-content-between align-items-center mt-2 px-3">
        <div className="d-flex align-items-center">
          <Pagination className="mb-0">{renderPaginationItems()}</Pagination>

          <Form.Select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ms-3"
            style={{ width: "120px" }}
          >
            <option value={1}>1 rows</option>
            <option value={2}>2 rows</option>
            <option value={5}>5 rows</option>
          </Form.Select>
        </div>
        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
          Page {currentPage || 1} of {totalPages || 1} •{" "}
          {CompanyList?.length || 0} items shown
        </div>
      </div> */}
    </div>
  );
}





export default CompanyTable;
