import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/paid-lot-items`;
const useFetchAllPaidLots = create((set) => ({
  AllPaidLotsList: [], 
  isAllPaidLotSucc:false,
  isLoadingAllPaidLots: false,
  errorAllPaidLots: null,

  fetchAllPaidLotList: async (userdata) => {
    set({ isLoadingAllPaidLots: true, error: null }); // Start isLoadingAllPaidLots
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ AllPaidLotsList: response, isAllPaidLotSucc:true }); // Update state with fetched data
    } catch (error) {
      set({
        errorAllPaidLots: error?.response?.data?.msg,
        AllPaidLotsList: [],
        isAllPaidLotSucc: false,
      }); // Handle errors
    }
    set({ isLoadingAllPaidLots: false });
  },
  ClearAllPaidLotList: () => {
    set({
      isAllPaidLotSucc: false,
      isLoadingAllPaidLots: false,
      errorAllPaidLots: null,
    });
  },
}));

export default useFetchAllPaidLots;
