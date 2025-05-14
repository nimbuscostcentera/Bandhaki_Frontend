import { create } from "zustand";
// import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/show-paymenttowholesaler`;
const useFetchWholesalerLoan = create((set) => ({
  WholeSalerLoanList: [],
  isLoadingWholeSalerLoanList: false,
  errorWholeSalerLoanList: null,
  isWholeSalerLoanListSuccess: false,

  fetchWholeSalerLoanList: async (userdata) => {
    set({ isLoadingWholeSalerLoanList: true, error: null }); // Start isLoadingWholeSalerLoanList
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ WholeSalerLoanList: response, isWholeSalerLoanListSuccess: true }); // Update state with fetched data
    } catch (error) {
      set({ errorWholeSalerLoanList: error.message }); // Handle errors
    }
    set({ isLoadingWholeSalerLoanList: false });
  },
  ClearWholeSalerLoanList: () =>
    set({
      isLoadingWholeSalerLoanList: false,
      errorWholeSalerLoanList: null,
      isWholeSalerLoanListSuccess:false,
    }),
}));

export default useFetchWholesalerLoan;
