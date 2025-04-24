import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/customer-list`;
const useFetchCust = create((set) => ({
  CustomerList: [],
  isLoadingCustList: false,
  errorCustList: null,

  fetchCustomrData: async (userdata) => {
    set({ isLoadingCustList: true, error: null }); // Start isLoadingCustList
    try {
        const result = await axiosInstance.post(API, userdata);
        const { data } = result;
        const { response } = data;
        set({ CustomerList:response }); // Update state with fetched data
    } catch (error) {
      set({ errorCustList: error.message }); // Handle errors
    }
    set({  isLoadingCustList: false }); 
  },
}));

export default useFetchCust;
