import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/customer-list`;
const useFetchCust = create((set) => ({
  CustomerList: [],
  isLoadingCustList: false,
  errorCustList: null,
  isCustSuccess: false,

  fetchCustomrData: async (userdata) => {
    set({ isLoadingCustList: true, error: null }); // Start isLoadingCustList
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ CustomerList: response, isCustSuccess: true }); // Update state with fetched data
    } catch (error) {
      set({ errorCustList: error?.response?.data?.response }); // Handle errors
    }
    set({ isLoadingCustList: false });
  },
  ClearStateCust: () => {
    set({
      CustomerList: [],
      isLoadingCustList: false,
      errorCustList: null,
      isCustSuccess: false,
    });
  },
}));

export default useFetchCust;
