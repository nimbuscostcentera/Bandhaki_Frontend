import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";

const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openinglot-check`;

const useFetchCheckLot = create((set) => ({
  CheckLotError: null,
  isCheckLotLoading: false,
  isCheckLotList: false,

  fetchCheckLot: async (payload) => {
    set({ isCheckLotLoading: true, CheckLotError: null });
    try {
      const result = await axiosInstance.post(API, payload);
      set({
        isCheckLotList: result.data.success,
        isCheckLotLoading: false,
      });
      return result.data; // Return API response
    } catch (error) {
        // console.log(error.response?.data)
      const errorMessage =
        error.response?.data?.response || "Failed to check Lot Number";
      set({
        CheckLotError: errorMessage,
        isCheckLotLoading: false,
      });
      throw new Error(errorMessage);
    }
  },
}));

export default useFetchCheckLot;
