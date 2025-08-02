import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/all-adjustlots`;
const useFetchLotNoNotran = create((set) => ({
  LotNoNoTranList: [],
  isLoadingLotNoNoTran: false,
  errorLotNoNoTran: null,

  fetchLotNoNoTranList: async (userdata) => {
    set({ isLoadingLotNoNoTran: true, error: null }); // Start isLoadingLotNoNoTran
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ LotNoNoTranList: response }); // Update state with fetched data
    } catch (error) {
      set({ errorLotNoNoTran: error.message }); // Handle errors
    }
    set({ isLoadingLotNoNoTran: false });
  },
  ClearLotNoNoTranList: () => {
    set({
      isLoadingLotNoNoTran: false,
      errorLotNoNoTran: null,
      LotNoNoTranList: [],
    });
  },
}));

export default useFetchLotNoNotran;
