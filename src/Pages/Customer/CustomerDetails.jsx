import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../Component/Table";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchCust from "../../store/ShowStore/useFetchCust";
import useEditCustomer from "../../store/UpdateStore/useEditCustomer";
import useRegCustomer from "../../store/AddStore/useRegCustomer";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import AdhaarValidation from "../../GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../GlobalFunctions/VoterCardValidation";
import PanCardValidation from "../../GlobalFunctions/PanCardValidation";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
import useCustomerDelete from "../../store/DeleteMasterStore/useCustomerDelete";
function CustomerDetails({ isDisable, setIsDisable, setTextDetail, search }) {
  const editinputref = useRef(null);
  const [Img, setImg] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [editedData, setEditedData] = useState({
    CustomerID: null,
    Name: null,
    ContactNumber: null,
    Address: null,
    GurdianName: null,
    DOB: null,
    IDPROOF_Type: null,
    FineID: -1,
    CompanyID: null,
    IDPROOF_IMG: null,
    IDPROOF: null,
    timing: -1,
  });
  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });

  const { CompanyID } = useFetchAuth();

  const {
    CustEditError,
    isCustEditLoading,
    CustEditSuccess,
    EditCustFunc,
    ClearStateEditCust,
  } = useEditCustomer();

  const {
    DeleteCustomer,
    ClearCustomerDelete,
    CustomerDeleteErr,
    isCustomerDeleteLoading,
    CustomerDeleteMsg,
  } = useCustomerDelete();

  const { CustRegSuccess } = useRegCustomer();
  const { CustomerList, fetchCustomrData, isLoadingCustList } = useFetchCust();
  const { FineHeaderList, fetchFineHeader } = useFetchFineHeader();

  const handleDelete = (id) => {
    const deleteobj = filteredData[id];
    console.log(deleteobj);
    if (deleteobj) {
      DeleteCustomer({ CustomerID: deleteobj.ID, CompanyID: CompanyID });
    }
  };
  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true);
    setEditedData({
      CustomerID: filteredData[tabindex]?.ID,
      Name: filteredData[tabindex]?.Name,
      ContactNumber: filteredData[tabindex]?.ContactNumber,
      Address: filteredData[tabindex]?.Address,
      GurdianName: filteredData[tabindex]?.GurdianName,
      DOB: filteredData[tabindex]?.DOB,
      IDPROOF_Type: filteredData[tabindex]?.IDPROOF_Type,
      FineID: filteredData[tabindex]?.FineID,
      FineCode: filteredData[tabindex]?.FineCode,
      CompanyID: filteredData[tabindex]?.CompanyID,
      IDPROOF_IMG: filteredData[tabindex]?.IDPROOF_IMG,
      IDPROOF: filteredData[tabindex]?.IDPROOF,
      timing: filteredData[tabindex]?.timing,
    });
  };
  console.log(editedData);
  const SortingFunc = (header, type) => {
    const currentOrder = checkOrder(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
      //console.log(result, "result");
    } else if (type === "Date") {
      // //console.log(type)
      result = SortArrayByDate(newOrder, filteredData, header);
      //console.log(result, "result date");
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }
    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID)); // Store order
  };
  const PictureHandler = (index, e) => {
    let value = e.target.files[0];
    setImg(value);
  };
  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveChange = () => {
    // console.log(editedData?.IDPROOF,editedData?.IDPROOF_Type);

    if (!/^\d{10}$/.test(editedData?.ContactNumber)) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!PhnoValidation(editedData?.ContactNumber)) {
      toast.error("Invalid Phone Number!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (editedData?.IDPROOF_Type == "Adhaar Card") {
      let check = AdhaarValidation(editedData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Adhaar Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (editedData?.IDPROOF_Type == "Voter Card") {
      let check = VoterCardValidation(editedData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct Voter Card Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    if (editedData?.IDPROOF_Type == "PAN Card") {
      let check = PanCardValidation(editedData?.IDPROOF);
      if (!check) {
        toast.error("Enter Correct PAN Card Number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }
    let obj = { ...editedData };
    let newFormData = new FormData();
    for (let key in obj) {
      if (
        editedData[key] !== undefined &&
        editedData[key] !== "" &&
        editedData[key] !== null &&
        editedData[key] !== -1
      ) {
        newFormData.append(key, editedData[key]);
      }
    }
    if (Img !== "" && Img) {
      newFormData.append("IDPROOF_IMG", Img);
    }
    EditCustFunc(newFormData);
  };

 const handleSearch = (e) => {
   const value = search.toLowerCase().trim(); // trim to ignore whitespace

   if (value === "") {
     setFilteredData(CustomerList); // show all rows if search is empty
     return;
   }

   const validFields = Col.map((col) => col.fieldname);

   const filtered = CustomerList.filter((order) =>
     validFields.some((field) =>
       order[field]?.toString().toLowerCase().includes(value)
     )
   );

   setFilteredData(filtered);
 };


  const SelectOptionIDProof = [
    { label: "--Select ID Proof--", value: -1 },
    { label: "Adhaar Card", value: "Adhaar Card" },
    { label: "Voter Card", value: "Voter Card" },
    { label: "PAN Card", value: "PAN Card" },
  ];

  const SelectOptionFineInterestCode = useMemo(() => {
    let frstVal = [{ label: "--Select Fine Interest Code--", value: -1 }];
    let fineList = FineHeaderList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
    return [...frstVal, ...fineList];
  }, [FineHeaderList]);

  const InterestCalculationTypeList = useMemo(() => {
    let arr = [
      { label: "--Interest Calculation Type--", value: -1 },
      { label: "Date-to-Date", value: 1 },
      { label: "Monthly", value: 2 },
      //{ label: "1st Day of Month", value: 3 },
    ];
    return arr;
  }, []);

  const Col = [
    {
      headername: "Customer Name",
      fieldname: "Name",
      type: "String",
      max: 50,
      width: 135,
      isUseInputRef: true,
    },
    {
      headername: "Phone No.",
      fieldname: "ContactNumber",
      type: "number",
      max: 10,
    },

    {
      headername: "DOB",
      fieldname: "DOB",
      type: "Date",
      max: 100,
      width: "90px",
    },

    {
      selectionname: "timing",
      headername: "Interest Type",
      fieldname: "interesttiming",
      type: "String",
      max: 100,
      width: 135,
      isSelection: true,
      options: InterestCalculationTypeList,
    },
    {
      selectionname: "FineID",
      headername: "Fine Code",
      fieldname: "FineCode",
      type: "String",
      max: 100,
      isSelection: true,
      options: SelectOptionFineInterestCode,
    },

    {
      headername: "ID Proof Img",
      fieldname: "IDPROOF_IMG",
      type: "Img",
      max: 100,
      isShortingOff: true,
      isNotEditable: true,
    },
    {
      selectionname: "IDPROOF_Type",
      headername: "ID Proof Type",
      fieldname: "IDPROOF_Type",
      type: "String",
      max: 100,
      width:"120px",
      isSelection: true,
      options: SelectOptionIDProof,
    },
    {
      headername: "ID Proof No.",
      fieldname: "IDPROOF",
      type: "String",
      width:"120px",
      max: 100,
    },
    {
      headername: "Guardian",
      fieldname: "GurdianName",
      type: "String",
      max: 100,
    }, 
    {
      headername: "Address",
      fieldname: "Address",
      type: "String",
      max: 300,
      width:"280px",
      isShortingOff: true,
    },
  ];

  useEffect(() => {
    fetchFineHeader({ CompanyID });
  }, []);
  //toaster
  useEffect(() => {
    if (isCustEditLoading && !CustEditSuccess && !CustEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (CustEditSuccess && !isCustEditLoading && !CustEditError) {
      toast.success("Customer Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        CustomerID: null,
        Name: null,
        ContactNumber: null,
        Address: null,
        GurdianName: null,
        DOB: null,
        IDPROOF_Type: null,
        FineID: -1,
        CompanyID: null,
        IDPROOF_IMG: null,
        IDPROOF: null,
        timing: null,
      });
      SetParams({ ActionID: null, IsAction: null });
      setIsDisable(false);
    } else if (CustEditError && !isCustEditLoading && !CustEditSuccess) {
      toast.error(CustEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditCust();
  }, [isCustEditLoading, CustEditSuccess, CustEditError]);

  useEffect(() => {
    fetchCustomrData({ CompanyID: CompanyID });
    if (originalOrder.length > 0 && CustomerList?.length > 0) {
      const sortedData = originalOrder
        .map((id) => CustomerList.find((row) => row.ID === id))
        .filter(Boolean);

      setFilteredData(sortedData);
    }
  }, [CustEditSuccess, CustRegSuccess, CustomerDeleteMsg]);

  //search option
  useEffect(() => {
    handleSearch();
  }, [search]);



  //filterdata
  useEffect(() => {
    let updatedData = CustomerList.map((item) => {
      if (item?.timing == 1) {
        item.interesttiming = "Date-to-Date";
      } else if (item?.timing == 2) {
        item.interesttiming = "Monthly";
      }
      return item;
    });

    if (originalOrder.length > 0) {
      updatedData = originalOrder
        .map((id) => updatedData.find((row) => row.ID === id))
        .filter(Boolean);
    }
    setFilteredData([...updatedData]);
  }, [isLoadingCustList, CustomerList]);

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 150);
  }, [editedData.CustomerID]);

  useEffect(() => {
    if (CustomerDeleteMsg) {
      toast.success(CustomerDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (CustomerDeleteErr) {
      toast.error(CustomerDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCustomerDelete();
  }, [CustomerDeleteErr, isCustomerDeleteLoading, CustomerDeleteMsg]);

  return (
    <div className="table-box mb-2">
      <Table
        tab={filteredData || []}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={(index, e) => OnChangeHandler(index, e)}
        OnSaveHandler={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        isLoading={isLoadingCustList}
        useInputRef={editinputref}
        getFocusText={(val) => {
          setTextDetail(val);
        }}
        isDelete={true}
        handleDelete={handleDelete}
        height={"85vh"}
        width={"100%"}
        PictureHandler={PictureHandler}
        img={Img}
      />
    </div>
  );
}

export default CustomerDetails;
