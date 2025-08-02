import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Table from "../../Component/Table";
import DeleteConfirmation from "../../Component/ReusableDelete";

import useFetchAuth from "../../store/Auth/useFetchAuth";
import useAddExtraItem from "../../store/AddStore/useAddExtraItem";
import useSearchDetailsView from "../../store/ShowStore/useSearchDetailsView";
import useSearchDetailsDeleteCheck from "../../store/Checker/useSearchDetailsDeleteCheck";
import useSearchDetailDelete from "../../store/DeleteStore/useSearchDetailDelete";

import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate"; 
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByTime from "../../GlobalFunctions/SortArrayByTime";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";

function SearchDetails({
  id,
  lotno,
  onCloseHandler,
  entityType,
  trancode,
  info,
  headerData,
  setDetailData,
  SearchFor,
}) {
  //-----------------------------------useref hook-----------------------------------//
  const editinputref = useRef(null);
  console.log(headerData, "headerData");
  //--------------------------------------useState--------------------------------------//
  const [focusText, setfocusText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
    page: 1,
    limit: 10,
    view: false,
    SRL: null,
    Valuation: null,
    isAdd: false,
    ItemCounter: 0,
    isDelete: false,
  });
  //-----------------------------------API Call---------------------------------------------------//
  const { user } = useFetchAuth();
  const {
    isSearchDetailsDeleteCheck,
    isSearchHeaderDeleteCheckLoading,
    SearchDetailsDeleteCheckErr,
    SearchDetailsDeleteCheckMsg,
    ClearSearchDetailsDeleteCheck,
    SearchDetailsDeleteCheck,
  } = useSearchDetailsDeleteCheck();
  const {
    ClearSearchDetailDelete,
    DeleteSearchDetail,
    isSearchDetailDeleteSucc,
    SearchDetailDeleteErr,
    isSearchDetailDeleteLoading,
    SearchDetailDeleteMsg,
  } = useSearchDetailDelete();
  const {
    fetchSearchDetailsViewDetails,
    ClearstateSearchDetailsViewList,
    SearchDetailsViewList,
    isSearchDetailListSuccess,
    SearchDetailsViewErrMsg,
    isSearchDetailsViewListLoading,
    isSearchDetailsViewListError,
  } = useSearchDetailsView();

  const { ExtraItemAddSuccess } = useAddExtraItem();

  //------------------------------------function---------------------------------------------------//
  const handleDeleteClick = (index) => {
    const selectedData = filteredData[index];
    console.log();
    SearchDetailsDeleteCheck({
      HeaderID: id,
      ...user,
    });
    setItemToDelete(selectedData);
  };
  // Confirm delete action
  const confirmDelete = () => {
    if (itemToDelete) {
      DeleteSearchDetail({
        DetailID: itemToDelete.ID,
        LotNo: lotno,
        Srl: itemToDelete.SRL,
        Cust_Type: entityType,
        TranCode: trancode,
      });
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };
  const handleSearch = (e) => {
    let value = search.toLowerCase();
    // Extract valid field names from the Col array
    const validFields = ColumnDetail.map((col) => col.fieldname);
    const filtered = SearchDetailsViewList?.filter((order) =>
      validFields?.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  //sorting
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
    // setOriginalOrder(result.map((row) => row.ID));
  };

  //-------------------------------------------------useEffect---------------------------------//
  //detail view list api call
  useEffect(() => {
    fetchSearchDetailsViewDetails({
      HeaderID: id,
      CompanyID: user?.CompanyID,
      Cust_Type: entityType,
    });
  }, [id, SearchDetailDeleteMsg, entityType]);

  //set filtered data
  useEffect(() => {
    if (isSearchDetailListSuccess) {
      if (originalOrder.length == 0 && SearchDetailsViewList.length > 0) {
        setFilteredData(SearchDetailsViewList);
      } else if (SearchDetailsViewList.length > 0 && originalOrder.length > 0) {
        let sortedData = originalOrder?.map((id) =>
          SearchDetailsViewList?.find((row) => row?.ID == id)
        );
        setFilteredData(sortedData);
      }
    }
    // if (isSearchDetailsViewListError || isOpeningPrincipalError) {
    if (isSearchDetailsViewListError) {
      // console.log("hi");
      setOriginalOrder((prev) => []);
      setFilteredData((prev) => []);
      onCloseHandler();
      // if (!isOpeningPrincipalError) {
      toast.error(SearchDetailsViewErrMsg, {
        position: "top-right",
        autoClose: 3000,
      });
      // }
    }
    ClearstateSearchDetailsViewList();
  }, [
    isSearchDetailsViewListLoading,
    isSearchDetailListSuccess,
    isSearchDetailsViewListError,
    ExtraItemAddSuccess,
  ]);

  //toaster for delete
  useEffect(() => {
    // toast.dismiss();
    if (SearchDetailDeleteMsg) {
      toast.success(SearchDetailDeleteMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (SearchDetailDeleteErr) {
      toast.error(SearchDetailDeleteErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    // let timeid = setTimeout(() => {
    //   ClearSearchDetailDelete();
    // }, 2000);
    ClearSearchDetailDelete();
    // return () => clearTimeout(timeid);
  }, [
    SearchDetailDeleteMsg,
    SearchDetailDeleteErr,
    isSearchDetailDeleteLoading,
  ]);

  //toaster for delete check
  useEffect(() => {
    if (isSearchDetailsDeleteCheck == 1) {
      if (itemToDelete) {
        setShowDeleteModal(true);
      }
    } else if (isSearchDetailsDeleteCheck == 0) {
      toast.error(SearchDetailsDeleteCheckErr, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearSearchDetailsDeleteCheck();
  }, [isSearchHeaderDeleteCheckLoading, isSearchDetailsDeleteCheck]);

  useEffect(() => {
    // if (search.length > 0) {
    handleSearch();
    // }
  }, [search]);
  useEffect(() => {
    setDetailData(filteredData);
  }, [isSearchDetailListSuccess]);
  //----------------------------------------const & var-------------------------------------------//
  let ColumnDetail = [
    {
      headername: "ID",
      fieldname: "ID",
      type: "number",
      isNotEditable: true,
      width: "40px",
    },
    {
      headername: "LotNo",
      fieldname: "LotNo",
      type: "String",
      isNotEditable: true,
      width: "70px",
    },
    {
      headername: "Srl",
      fieldname: "SRL",
      type: "number",
      width: "45px",
      isNotEditable: true,
    },
    {
      headername: "Mh. Name",
      fieldname: "MahajanName",
      type: "String",
      isNotEditable: true,
      width: "70px",
    },
    {
      headername: "Item Desc.",
      fieldname: "Description",
      type: "String",
      isNotEditable: true,
      width: "250px",
    },
    {
      headername: "Date",
      fieldname: "ItemDate",
      type: "BongDate",
      width: "90px",
    },
  ];

  if (entityType != 3) {
    ColumnDetail.push({
      headername: "warehouse",
      fieldname: "WareHouseName",
      type: "String",
      width: "50px",
    });
  }
  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center m-0 flex-wrap">
        <div>
          <textarea
            value={focusText}
            type="search"
            readOnly
            placeholder="Detail View"
            style={{
              width: "98vw",
              border: "1px solid dodgerblue",
              outline: "1px solid dodgerblue",
              borderRadius: "5px",
              padding: "0px 5px",
            }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Table
          tab={filteredData || []}
          Col={ColumnDetail}
          isLoading={isSearchDetailsViewListLoading}
          isDelete={true}
          setParams={setParams}
          getFocusText={(value) => {
            setfocusText(value);
          }}
          onSorting={SortingFunc}
          ActionId={params?.ActionID}
          handleDelete={handleDeleteClick}
          useInputRef={editinputref}
          height={"80vh"}
        />
        <DeleteConfirmation
          show={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
}

export default SearchDetails;
