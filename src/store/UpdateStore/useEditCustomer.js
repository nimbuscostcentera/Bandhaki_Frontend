import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/customer-edit`;
const useEditCustomer = create((set) => ({
  CustEditSuccess: null,
  isCustEditLoading: false,
  CustEditError: null,

  EditCustFunc: async (userdata) => {
    set({
      isCustEditLoading: true,
      CustEditError: null,
      CustEditSuccess: null,
    }); // Start loading
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axiosInstance.put(API, userdata, config);
      const { response } = data;
      set({
        CustEditSuccess: response,
        isCustEditLoading: false,
        CustEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CustEditError: error?.response?.data?.response,
        isCustEditLoading: false,
        CustEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditCust: () => {
    set({
      CustEditSuccess: null,
      isCustEditLoading: false,
      CustEditError: null,
    });
  },
}));

export default useEditCustomer;
