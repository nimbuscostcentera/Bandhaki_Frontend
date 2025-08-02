import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Ordercheck from "../../GlobalFunctions/Ordercheck";
import SortArrayByString from "../../GlobalFunctions/SortarrayByString";
import SortArrayByDate from "../../GlobalFunctions/SortArrayByDate";
import SortArrayByNumber from "../../GlobalFunctions/SortArrayByNumber";

import Table from "../../Component/Table";

import useFetchUser from "../../store/ShowStore/useFetchUser";
import useAddUser from "../../store/AddStore/useAddUser";
import useEditUser from "../../store/UpdateStore/useEditUser";
import PhnoValidation from "../../GlobalFunctions/PhnoValidation";
import useFetchAuth from "../../store/Auth/useFetchAuth";

function UserTable({ setIsDisable, search }) {
  const { UserList, isUserLoading, fetchUserMaster } = useFetchUser();
  const { AddUserSuccess } = useAddUser();
  const [filteredData, setFilteredData] = useState([]);
  const { CompanyID } = useFetchAuth();
   const [originalOrder, setOriginalOrder] = useState([]);
  const [params, SetParams] = useState({
    ActionID: null,
    IsAction: false,
  });

  const utypeOptions = [
    {
      label: "Admin",
      value: 1,
    },
    {
      label: "User",
      value: 2,
    },
  ];

  // const {
  //   UserEditError,
  //   isUserEditLoading,
  //   UserEditSuccess,
  //   EditUserFunc,
  //   ClearStateEditUser,
  // } = useEditCity();
  const {
    UserEditError,
    isUserEditLoading,
    UserEditSuccess,
    EditUserFunc,
    ClearStateEditUser,
  } = useEditUser();

  const Col = [
    {
      headername: "User Name",
      fieldname: "Name",
      type: "String",
      isUseInputRef: true,
    },
    { headername: "Phone Number", fieldname: "ContactNumber", type: "number" },
    {
      headername: "Company Name",
      fieldname: "CompanyName",
      type: "String",
      isNotEditable: true,
    },
    {
      headername: "Utype",
      fieldname: "UserType",
      selectionname: "Utype",
      type: "number",
      isSelection: true,
      options: utypeOptions,
    },
  ];

  const [editedData, setEditedData] = useState({
    id: null,
    Name: null,
    ContactNumber: null,
    Utype: null,
    CompanyID: null,
  });
  const editinputref = useRef(null);
  
    const handleSearch = (e) => {
      const value = search.toLowerCase().trim(); // trim to ignore whitespace

      const validFields = Col.map((col) => col.fieldname);

      const filtered = UserList.filter((order) =>
        validFields.some((field) =>
          order[field]?.toString().toLowerCase().includes(value)
        )
      );
filtered.forEach(element => {
  element.UserType = element.Utype == 1 ? "Admin" : "User";
});
      setFilteredData(filtered);
    };

    useEffect(() => {
      handleSearch();
    }, [search]);
  
      useEffect(() => {
        setTimeout(() => {
          if (editinputref.current) {
            editinputref.current.focus();
          }
        }, 90);
      }, [editedData.id]);

  useEffect(() => {
    fetchUserMaster({ CompanyID: CompanyID });
     if (originalOrder.length > 0 && UserList?.length > 0) {
       const sortedData = originalOrder
         .map((id) => UserList.find((row) => row.ID === id))
         .filter(Boolean);
         sortedData.forEach(element => {
           element.UserType = element.Utype == 1 ? "Admin" : "User";
         });
       setFilteredData(sortedData);
     }
  }, [AddUserSuccess, UserEditSuccess]);

  useEffect(() => {
    let updatedData = UserList.map((item) => ({ ...item }));
    if (originalOrder.length > 0) {
      updatedData = originalOrder
        .map((id) => updatedData.find((row) => row.ID === id))
        .filter(Boolean);
    }
    updatedData.forEach(element => {
      element.UserType = element.Utype == 1 ? "Admin" : "User";
    })
    setFilteredData([...updatedData]);
  }, [isUserLoading, UserEditSuccess, AddUserSuccess]);

  const ActionFunc = (tabindex) => {
    SetParams((prev) => ({ ...prev, IsAction: true, ActionID: tabindex }));
    setIsDisable(true);
    setEditedData({
      id: filteredData[tabindex]?.ID,
      Name: filteredData[tabindex]?.Name,
      ContactNumber: filteredData[tabindex]?.ContactNumber,
      Utype: filteredData[tabindex]?.Utype,
      CompanyID: filteredData[tabindex]?.CompanyID,
    });
  };

  const SortingFunc = (header, type) => {
    if (!filteredData || filteredData.length === 0) {
      // console.error("No data to sort");
      return;
    }
    const currentOrder = Ordercheck(filteredData, header);
    const newOrder = currentOrder === "Asc" ? "Desc" : "Asc";
    //console.log(currentOrder, newOrder, "Current order, new oreder");
    let result;
    if (type === "String") {
      //console.log("In string");

      result = SortArrayByString(newOrder, filteredData, header);
      //console.log(result, "for string");
      // }
    } else if (type === "Date") {
      result = SortArrayByDate(newOrder, filteredData, header);
    } else if (type === "number") {
      result = SortArrayByNumber(newOrder, filteredData, header);
    }

    setFilteredData([...result]);
    setOriginalOrder(result.map((row) => row.ID));
  };
  const OnChangeHandler = (index, e) => {
    // //console.log(e,"e")
    let key = e.target.name;
    let value = e.target.value;
    // let data={...filteredData[index]}
    // //console.log(data)
    // data[key]=value;

    setEditedData((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const SaveChange = () => {
    // //console.log(editedData);
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
    EditUserFunc(editedData);
  };

  useEffect(() => {
    if (UserEditSuccess && !isUserEditLoading && !UserEditError) {
      toast.dismiss();
      toast.success("User Edited Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditedData({
        id: null,
        Name: null,
        ContactNumber: null,
        Utype: null,
        CompanyID: null,
      });
      SetParams({ ActionID: null, IsAction: null });
      setIsDisable(false);
    }
    if (UserEditError && !isUserEditLoading && !UserEditSuccess) {
      toast.dismiss();
      toast.error(UserEditError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    ClearStateEditUser();
  }, [isUserEditLoading, UserEditSuccess, UserEditError]);

  return (
    <div style={{ width: "auto", overflow: "auto", height: "50vh" }}>
      <Table
        tab={filteredData || []}
        isAction={params?.IsAction}
        ActionFunc={ActionFunc}
        ActionId={params?.ActionID}
        OnChangeHandler={OnChangeHandler}
        OnSaveHandler={SaveChange}
        onSorting={SortingFunc}
        Col={Col}
        isEdit={true}
        EditedData={editedData}
        useInputRef={editinputref}
      />
    </div>
  );
}

export default UserTable;
