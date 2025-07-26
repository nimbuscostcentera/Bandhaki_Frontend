import React, { useEffect, useMemo } from "react";
import Table from "../../Component/Table";
import { useState } from "react";
import checkOrder from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";

import { toast } from "react-toastify";

import useEditGroupCost from "../../store/UpdateStore/useEditGroupCost";
import useFetchGoldRate from "../../store/ShowStore/useFetchGoldRate";
import useAddGoldRate from "../../store/AddStore/useAddGoldRate";
import useEditGoldRate from "../../store/UpdateStore/useEditGoldRate";
import useFetchPurity from "../../store/ShowStore/useFetchPurity";
import useFetchAuth from "../../store/Auth/useFetchAuth";
import BongDateSorting from "../../GlobalFunctions/BongDateSorting";
function GoldRateTable({ setIsDisable, search }) {
  const [editedData, setEditedData] = useState({
    ID: null,
    GOLD_RATE: null,
    CompanyID: null,
    PURITY: "",
    PurityID: null,
  });
  // console.log(editedData);
  const { CompanyID } = useFetchAuth();
    const [originalOrder, setOriginalOrder] = useState([]);


  // console.log(editedData);
  const [filteredData, setFilteredData] = useState([]);
  const [params, setParams] = useState({
    ActionID: -1,
    IsAction: false,
  });

  const { isGoldRateLoading, GoldRateList, fetchGoldRate } = useFetchGoldRate();

  const {
    EditGoldRateFunc,
    GoldRateEditError,
    isGoldRateEditLoading,
    GoldRateEditSuccess,
    ClearStateEditGoldRate,
  } = useEditGoldRate();
  const { GoldRateSuccess } = useAddGoldRate();

  // Fetch company list when new data is added or item is edited
  useEffect(() => {
    fetchGoldRate({ CompanyID: CompanyID });
      if (originalOrder.length > 0 && GoldRateList?.length > 0) {
        const sortedData = originalOrder
          .map((id) => GoldRateList?.find((row) => row.ID === id))
          .filter(Boolean);

        setFilteredData(sortedData);
      }
  }, [GoldRateSuccess, GoldRateEditSuccess]);

  useEffect(() => {
    let updatedData = [];
    updatedData=GoldRateList?.map((item) => ({ ...item }));
  if (originalOrder.length > 0) {
    updatedData = originalOrder
      .map((id) => updatedData.find((row) => row.ID === id))
      .filter(Boolean);
    }
    if (Array.isArray(updatedData)) {
      setFilteredData([...updatedData]);
    } 
  }, [GoldRateList, isGoldRateLoading, GoldRateEditSuccess]);

  // Column configuration for the table headers
  const Col = [
    {
      headername: "Gold Rate",
      fieldname: "GOLD_RATE",
      type: "number",
      width: "100px",
    },
    {
      headername: "Date",
      fieldname: "CURRDATE",
      type: "BongDate",
    },
    {
      headername: "Time",
      fieldname: "CURRTIME",
      type: "String",
    },
  ];



  // Sorting function for the table
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
    } else if (type == "BongDate") {
          result = BongDateSorting(newOrder, filteredData, header);
        }

    setFilteredData(result);
    setOriginalOrder(result.map((row) => row.ID)); // Store order
  };

    // Handling changes in the form
    const validateGoldRate = (value) => {
      const regex = /^\d{0,10}(\.\d{0,2})?$/; // 5 digits before decimal, up to 2 digits after
      return regex.test(value);
    };
    const OnChangeHandler = (index, e) => {
      const { name, value } = e.target;
        if (name === "GOLD_RATE") {
          if (validateGoldRate(value)) {
            setEditedData((prev) => ({ ...prev, [name]: value }));
          }
        } else {
          setEditedData((prev) => ({ ...prev, [name]: value }));
        }
    };

  
  const handleSearch = (e) => {
    const value = search.toLowerCase().trim(); // trim to ignore whitespace

    // if (value === "") {
    //   setFilteredData(CustomerList); // show all rows if search is empty
    //   return;
    // }

    const validFields = Col.map((col) => col.fieldname);

    const filtered = GoldRateList.filter((order) =>
      validFields.some((field) =>
        order[field]?.toString().toLowerCase().includes(value)
      )
    );

    setFilteredData(filtered);
  };

  // Save the changes made to a company
  const SaveChange = () => {
    EditGoldRateFunc({ ...editedData });
  };

    useEffect(() => {
      handleSearch();
    }, [search]);
  // Handle success or failure of the edit action
  useEffect(() => {
    if (GoldRateEditSuccess && !isGoldRateEditLoading && !GoldRateEditError) {
      toast.success("Gold Rate Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setParams({ ActionID: -1, IsAction: false });
      setEditedData({
        ID: null,
        GOLD_RATE: null,
        CompanyID: null,
        PURITY: "",
        PurityID: null,
      });
      setIsDisable(false);
    } else if (
      GoldRateEditError &&
      !isGoldRateEditLoading &&
      !GoldRateEditSuccess
    ) {
      toast.error(GoldRateEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditGoldRate();
  }, [isGoldRateEditLoading, GoldRateEditSuccess, GoldRateEditError]);

  return (
    <div
      className="table-box"
      style={{ height: "60vh",  }}
    >
      <Table
        tab={filteredData}
        isAction={params?.IsAction}
        // ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        isLoading={isGoldRateLoading}
      />
    </div>
  );
}

export default GoldRateTable;
