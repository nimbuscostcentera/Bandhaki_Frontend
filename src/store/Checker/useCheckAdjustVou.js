import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/`;
const useCheckAdjustVou = create((set) => ({
  CheckAdjustVouMsg: "",
  isCheckAdjustVouLoading: false,
  CheckAdjustVouErr: null,

  CheckAdjustVou: async (userdata) => {
    set({ isCheckAdjustVouLoading: true, CheckAdjustVouErr: null }); // Start loading
    try {
      const result = await axiosInstance.delete(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ CheckAdjustVouMsg: response }); // Update state with fetched data
    } catch (error) {
      set({ CheckAdjustVouErr: error.message }); // Handle errors
    }
    set({ isCheckAdjustVouLoading: false });
  },
  ClearCheckAdjustVou: () => {
    set({
      isCheckAdjustVouLoading: false,
      CheckAdjustVouErr: null,
    });
  },
}));

export default useCheckAdjustVou;
