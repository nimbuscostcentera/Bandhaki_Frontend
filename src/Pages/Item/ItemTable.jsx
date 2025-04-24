import React, { useEffect } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import useFetchItem from "../../store/ShowStore/useFetchItem";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";
import useAddItem from "../../store/AddStore/useAddItem";
import useEditItem from "../../store/UpdateStore/useEditItem";
import { toast } from "react-toastify";
import useFetchAuth from "../../store/Auth/useFetchAuth";
function ItemTable({ setIsDisable }) {
  const [editedData, setEditedData] = useState({
    itemId: null,
    ITEMCODE: null,
    DESCRIPTION: null,
  });
  //console.log(editedData);
   const [originalOrder, setOriginalOrder] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });
   const { CompanyID } = useFetchAuth();
  const { ItemRegSuccess } = useAddItem();
  const { ItemError, isItemLoading, ItemList, fetchItemMaster, clearItemList } =
    useFetchItem();
  const {
    EditItemFunc,
    ItemEditError,
    isItemEditLoading,
    ItemEditSuccess,
    ClearStateEditItem,
  } = useEditItem();

  useEffect(() => {
    fetchItemMaster({ companyId: CompanyID });
     if (originalOrder.length > 0 && ItemList?.length > 0) {
       const sortedData = originalOrder
         .map((id) => ItemList.find((row) => row.ID === id))
         .filter(Boolean);

       setFilteredData(sortedData);
     }
  }, [ItemRegSuccess, ItemEditSuccess]);

  useEffect(() => {
    let updatedData = ItemList.map((item) => ({ ...item }));
    if (originalOrder.length > 0) {
      updatedData = originalOrder
        .map((id) => updatedData.find((row) => row.ID === id))
        .filter(Boolean);
    }
    setFilteredData([...updatedData]);
  }, [ItemList, isItemLoading, ItemEditSuccess, ItemRegSuccess]);
  const Col = [
    { headername: "Item Code", fieldname: "ITEMCODE", type: "String" },
    // { headername: "Purity", fieldname: "Purity", type: "String" },
    { headername: "Description", fieldname: "DESCRIPTION", type: "String" },
  ];

  const ActionFunc = (tabIndex) => {
    setParams((prev) => ({ ...prev, IsAction: true, ActionID: tabIndex }));
    setIsDisable(true);
    const selectedData = filteredData[tabIndex];
    if (selectedData) {
      setEditedData({
        itemId: selectedData.ID,
        ITEMCODE: selectedData.ITEMCODE || "",
        DESCRIPTION: selectedData.DESCRIPTION || "",
      });
    }
  };

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
    }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID));
  };
  const OnChangeHandler = (index, e) => {
    let key = e.target.name;
    let value = e.target.value;
    setEditedData({ ...editedData, [key]: value });
  };
  const SaveChange = () => {
    //console.log("Saving changes...", editedData);
    // EditArtisanFunc(editedData);
    EditItemFunc({ ...editedData, CompanyID: CompanyID });
  };
  useEffect(() => {
    if (isItemEditLoading && !ItemEditSuccess && !ItemEditError) {
      toast.play("pleaes wait...", {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (ItemEditSuccess && !isItemEditLoading && !ItemEditError) {
      toast.success("Item Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        itemId: null,
        ITEMCODE: null,
        DESCRIPTION: null,
      });
      setIsDisable(false);
      
    } else if (ItemEditError && !isItemEditLoading && !ItemEditSuccess) {
      toast.error(ItemEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditItem();
  }, [isItemEditLoading, ItemEditSuccess, ItemEditError]);
  return (
    <div
      className="table-box"
      style={{ height: "55vh", border: "1px solid lightgrey" }}
    >
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
        isLoading={isItemLoading}
      />
    </div>
  );
}

export default ItemTable;
