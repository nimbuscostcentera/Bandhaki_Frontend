import React, { useEffect, useState } from "react";
// import useFetchOpeningDetailReport from "../../store/ShowStore/useFetchOpeningDetailReport";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import Table from "../../Component/Table";
import useFetchAdjustDetailReport from "../../store/ShowStore/useFetchAdjustDetailReport";
import useAdjustVouDelete from "../../store/DeleteStore/useAdjustVoucherDelete";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Component/ReusableDelete";
import useAdjustDeleteCheck from "../../store/Checker/useAdjustDeleteCheck";
function AdjustEntryDetailTableView({
  id,
  CustomerID,
  handleClose,
  entityType,
}) {
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [Cust_ID, setCust_ID] = useState(CustomerID);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
 
  const { user } = useFetchAuth();
  const {
    fetchAdjustDetail,
    ClearstateAdjustDetailList,
    AdjustDetailList,
    isAdjustDetailListSuccess,
    isAdjustDetailLoading,
    isAdjustDetailError,
  } = useFetchAdjustDetailReport();
  const {
    DeleteAdjustVou,
    ClearAdjustVouDelete,
    AdjustVouDeleteErr,
    isAdjustVouDeleteLoading,
    AdjustVouDeleteMsg,
  } = useAdjustVouDelete();

  const {
    CheckAdjustDeleteCheckMsg,
    isCheckAdjustDeleteCheck,
    isCheckAdjustDeleteCheckLoading,
    CheckAdjustDeleteCheckErr,
    ClearCheckAdjustDeleteCheck,
    CheckAdjustDeleteCheck,
  } = useAdjustDeleteCheck();
  useEffect(() => {
    setCust_ID(CustomerID);
}, [CustomerID]);

  useEffect(() => {
    if (isCheckAdjustDeleteCheck == 1) {
      // If check passes, show the delete confirmation modal
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isCheckAdjustDeleteCheck === 2) {
      toast.dismiss();
      toast.warning(CheckAdjustDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearCheckAdjustDeleteCheck();
  }, [isCheckAdjustDeleteCheckLoading, isCheckAdjustDeleteCheck]);

  let ColumnDetail = [
    {
      headername: "Lot No",
      fieldname: "LotNo",
      type: "String",
    },
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "String",
    },
    {
      headername: "Srl Prn",
      fieldname: "SRL_Prn",
      type: "String",
    },
    {
      headername: "Principal Cr",
      fieldname: "Principal_CR",
      type: "number",
    },
    {
      headername: "Interest Cr",
      fieldname: "Int_CR",
      type: "number",
    },

    {
      headername: "Total Amount",
      fieldname: "Total_Amt",
      type: "number",
    },
  ];

   const handleDeleteClick = (index) => {
     const selectedObj = filteredData[index];
     console.log(selectedObj, "selectedObj");
     if (!Cust_ID) {
       return
     }
     console.log(Cust_ID)
     CheckAdjustDeleteCheck({
       ID: selectedObj?.ID,
       Cust_ID: Cust_ID,
       Cust_Type: entityType,
     });
     setItemToDelete(selectedObj);
     //  setShowDeleteModal(true);
   };
  console.log(Cust_ID);

   const confirmDelete = () => {
     if (itemToDelete) {
       DeleteAdjustVou({
         ID: itemToDelete?.ID,
         Cust_ID: Cust_ID,
         Cust_Type: entityType,
       });
       setShowDeleteModal(false);
       setItemToDelete(null);
     }
   };

   const cancelDelete = () => {
     setShowDeleteModal(false);
     setItemToDelete(null);
   };

  const handleDelete = (id) => {
    let deleteobj = filteredData[id];
    if (deleteobj) {
      DeleteAdjustVou({
        ID: deleteobj.ID,
        Cust_ID: Cust_ID,
        Cust_Type: entityType,
      });
    }
  };
    const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) return;
    let currentOrder = "";
    let isAsc = false;
    let isDesc = false;
    if (type == "time") {
      for (let i = 0; i < filteredData.length - 1; i++) {
        let a = parseInt(
          (filteredData[i]?.[header]).toString().replace(/:/g, ""),
          10
        );
        let b = parseInt(
          (filteredData[i + 1]?.[header]).toString().replace(/:/g, ""),
          10
        );
        if (a > b) {
          isAsc = true;
        }
        if (b > a) {
          isDesc = true;
        }
      }
      if (isAsc) {
        currentOrder = "Desc";
      }
      if (isDesc) {
        currentOrder = "Asc";
      }
    } else {
      currentOrder = checkOrder(filteredData, header);
    }

    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";

    let result;
    if (type === "String") {
      result = SortArrayByString(newOrder, filteredData, header);
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    } else if (type == "BongDate") {
      result = BongDateSorting(newOrder, filteredData, header);
    } else if (type == "time") {
      result = SortArrayByTime(newOrder, filteredData, header);
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };

  useEffect(() => {
    if (AdjustVouDeleteMsg) {
      toast.success(AdjustVouDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      // handleClose();
    }
    if (AdjustVouDeleteErr) {
      toast.error(AdjustVouDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearAdjustVouDelete();
  }, [AdjustVouDeleteErr, isAdjustVouDeleteLoading, AdjustVouDeleteMsg]);

  useEffect(() => {
    if (isAdjustDetailError) {
      handleClose();
    }
    ClearstateAdjustDetailList();
  }, [isAdjustDetailError]);

 
  useEffect(() => {
    fetchAdjustDetail({
      HeaderId: id,
      CustomerID: Cust_ID,
      Cust_Type: entityType,
    });
    if (originalOrder.length == 0 && AdjustDetailList.length > 0) {
      setFilteredData(AdjustDetailList);
    } else if (AdjustDetailList.length > 0 && originalOrder.length > 0) {
      let sortedData = originalOrder?.map((id) =>
        AdjustDetailList?.find((row) => row?.ID == id)
      );
      setFilteredData(sortedData);
    }
  }, [id, AdjustVouDeleteMsg]);

  useEffect(() => {
    setFilteredData([]);
    if (AdjustDetailList && AdjustDetailList.length >= 0) {
      setFilteredData(AdjustDetailList);
    }
    ClearstateAdjustDetailList();
  }, [AdjustDetailList, entityType, id, Cust_ID]);

  return (
    <div
      className="table-box"
      style={{ height: "55vh", border: "1px solid lightgrey" }}
    >
      <Table
        tab={filteredData}
        Col={ColumnDetail}
        isLoading={isAdjustDetailLoading}
        isDelete={true}
        // handleDelete={handleDelete}
        handleDelete={handleDeleteClick}
        onSorting={SortingFunc}
      />
      <DeleteConfirmation
        show={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default AdjustEntryDetailTableView;
