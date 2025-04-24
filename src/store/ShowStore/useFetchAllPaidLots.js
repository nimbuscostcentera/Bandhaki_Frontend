import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/paid-lot-items`;
const useFetchAllPaidLots = create((set) => ({
  AllPaidLotsList: [], 
  isLoadingAllPaidLots: false,
  errorAllPaidLots: null,
  pageoptions: {
    totalOpeningSearchRecords: 0,
    totalOpeningSearchPages: 0,
    OpeningSearchCurrentPage: 0,
  },

  fetchAllPaidLotList: async (userdata) => {
    set({ isLoadingAllPaidLots: true, error: null }); // Start isLoadingAllPaidLots
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ AllPaidLotsList: response }); // Update state with fetched data
    } catch (error) {
      set({ errorAllPaidLots: error.message }); // Handle errors
    }
    set({ isLoadingAllPaidLots: false });
  },
  ClearAllPaidLotList: () => {
    set({ isLoadingAllPaidLots: false, errorAllPaidLots: null });
  },
}));

export default useFetchAllPaidLots;
