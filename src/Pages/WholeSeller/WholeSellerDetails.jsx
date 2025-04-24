import React, { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Table from "../../Component/Table";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import useFetchWS from "../../store/ShowStore/useFetchWS";
import useEditWholeSeller from "../../store/UpdateStore/useEditWholeSeller";
import useRegWholeSeller from "../../store/AddStore/useRegWholeSeller";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import AdhaarValidation from "../../GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../GlobalFunctions/VoterCardValidation";
import PanCardValidation from "../../GlobalFunctions/PanCardValidation";
import useWholeSellerDelete from "../../store/DeleteMasterStore/useWholeSellerDelete";
import useFetchFineHeader from "../../store/ShowStore/useFetchFineHeader";
function WholeSellerDetails({
  isDisable,
  setIsDisable,
  setTextDetail,
  search,
}) {
  const editinputref = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [params, SetParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
  const [editedData, setEditedData] = useState({
    ID: null,
    Name: null,
    ContactNumber: null,
    Address: null,
    GurdianName: null,
    DOB: null,
    IDPROOF_Type: null,
    FinePercentage: null,
    CompanyID: null,
    IDPROOF_IMG: null,
    IDPROOF: null,
  });

  const { CompanyID } = useFetchAuth();
  const { FineHeaderList, fetchFineHeader, isFineHeaderLoading } =
    useFetchFineHeader();
  const {
    DeleteWholeSeller,
    ClearWholeSellerDelete,
    WholeSellerDeleteErr,
    isWholeSellerDeleteLoading,
    WholeSellerDeleteMsg,
  } = useWholeSellerDelete();
  const {
    WSEditError,
    isWSEditLoading,
    WSEditSuccess,
    EditWSFunc,
    ClearStateEditWS,
  } = useEditWholeSeller();
  const { WSRegSuccess } = useRegWholeSeller();

  const {
    WholeSellerList,
    fetchWSomrData,
    WSError,
    isLoadingWSList,
    ClearWSList,
  } = useFetchWS();

  const ActionFunc = (tabindex) => {
    // console.log("hello", tabindex)
    // console.log(filteredData[tabindex])
    const newParams = { IsAction: true, ActionID: tabindex };
    SetParams(newParams);
    console.log(newParams, "newParams");
    setIsDisable(true);
    setEditedData({
      WholeSellerID: filteredData[tabindex]?.ID,
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
    });
  };

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
    setOriginalOrder(result.map((row) => row.ID));
  };

  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    // console.log(key, value);
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };
  const SaveChange = () => {
    console.log(editedData?.IDPROOF, editedData?.IDPROOF_Type);

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
    EditWSFunc(newFormData);
  };
  const handleDelete = (id) => {
    const deleteobj = filteredData[id];
    // console.log(deleteobj);
    if (deleteobj) {
      DeleteWholeSeller({ ID: deleteobj.ID });
    }
  };

  const handleSearch = (e) => {
    const value = search.toLowerCase();

    // Extract valid field names from the Col array
    const validFields = Col.map((col) => col.fieldname);

    const filtered = WholeSellerList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
    console.log("search")
  };
  //toaster
  useEffect(() => {
    if (isWSEditLoading && !WSEditSuccess && !WSEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (WSEditSuccess && !isWSEditLoading && !WSEditError) {
      toast.success("WholeSeller Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        WholeSellerID: null,
        Name: null,
        ContactNumber: null,
        Address: null,
        GurdianName: null,
        DOB: null,
        IDPROOF_Type: null,
        FinePercentage: null,
        CompanyID: null,
        IDPROOF_IMG: null,
        IDPROOF: null,
      });
      SetParams({ ActionID: -1, IsAction: false });
      setIsDisable(false);
    } else if (WSEditError && !isWSEditLoading && !WSEditSuccess) {
      toast.error(WSEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditWS();
  }, [isWSEditLoading, WSEditSuccess, WSEditError]);

  useEffect(() => {
    if (WholeSellerDeleteMsg) {
      toast.success(WholeSellerDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (WholeSellerDeleteErr) {
      toast.error(WholeSellerDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearWholeSellerDelete();
  }, [WholeSellerDeleteErr, isWholeSellerDeleteLoading, WholeSellerDeleteMsg]);

  useEffect(() => {
    setTimeout(() => {
      if (editinputref.current) {
        editinputref.current.focus();
      }
    }, 100);
  }, [editedData.ID]);

  useEffect(() => {
    handleSearch();
  }, [search]);

useEffect(() => {
  fetchWSomrData({ CompanyID: CompanyID });
}, [WSRegSuccess, WSEditSuccess, WholeSellerDeleteMsg,]);
  console.log(
    "WholeSellerList",
    filteredData,
    isLoadingWSList,
    WholeSellerList
  );
  
  useEffect(() => {
    if ( WholeSellerList?.length>=0) {
      let updatedData = WholeSellerList?.map((item) => {
        item.InterestType = item.timing == 2 ? "Monthly" : "";
        return item;
      });
      if (originalOrder.length > 0 && originalOrder?.length == 0) {
        updatedData = originalOrder
          ?.map((id) => updatedData?.find((row) => row.ID === id))
          ?.filter(Boolean);
      }
      setFilteredData([...updatedData]);
      ClearWSList();
      console.log("in useeffect")
    }

  }, [isLoadingWSList, WholeSellerList]);

  const SelectOptionFineInterestCode = useMemo(() => {
    let frstVal = [{ Name: "--Select Fine Interest Code--", Value: -1 }];
    let fineList = FineHeaderList.map((item) => ({
      label: `${item?.CODE}`,
      value: item?.ID,
    }));
    return [...frstVal, ...fineList];
  }, [FineHeaderList]);

  const InterestTypeList = [
    { label: "--select interest type", value: -1 },
    { label: "Monthly", value: 2 },
    { label: "1st Day of Month", value: 3 },
  ];

  const SelectOptionIDProof = [
    { label: "--Select ID Proof--", value: -1 },
    { label: "Adhaar Card", value: "Adhaar Card" },
    { label: "Voter Card", value: "Voter Card" },
    { label: "PAN Card", value: "PAN Card" },
  ];

  const Col = [
    {
      headername: "WholeSeller Name",
      fieldname: "Name",
      type: "String",
      max: 50,
      width: 145,
      isUseInputRef: true,
    },
    {
      headername: "Phone No.",
      fieldname: "ContactNumber",
      type: "number",
      max: 10,
    },

    { headername: "DOB", fieldname: "DOB", type: "date", max: 100 },
    {
      headername: "Guardian",
      fieldname: "GurdianName",
      type: "String",
      max: 100,
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
      headername: "Interest Type",
      fieldname: "InterestType",
      selectionname: "timing",
      type: "String",
      isSelection: true,
      options: InterestTypeList,
    },
    {
      selectionname: "IDPROOF_Type",
      headername: "ID Proof Type",
      fieldname: "IDPROOF_Type",
      type: "String",
      max: 100,
      width: 135,
      isSelection: true,
      options: SelectOptionIDProof,
    },
    {
      headername: "ID Proof No.",
      fieldname: "IDPROOF",
      type: "String",
      max: 100,
      width: 135,
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
      headername: "Address",
      fieldname: "Address",
      type: "String",
      max: 100,
      width: 250,
      isShortingOff: true,
    },
  ];

  return (
    <div
      className="table-box"
      style={{ height: "55vh", border: "1px solid lightgrey" }}
    >
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
        isLoading={isLoadingWSList}
        useInputRef={editinputref}
        isDelete={true}
        handleDelete={handleDelete}
        getFocusText={(val) => {
          setTextDetail(val);
        }}
      />
    </div>
  );
}

export default WholeSellerDetails;
