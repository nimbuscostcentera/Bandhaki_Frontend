import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/checkedit-openingprincipal`;
const useCheckOpeningPrn = create((set) => ({
  CheckOpeningPrnMsg: "",
  isOpenPrnsuccess: 0,
  isCheckOpeningPrnLoading: false,
  CheckOpeningPrnErr: null,

  CheckOpeningPrn: async (userdata) => {
    set({ isCheckOpeningPrnLoading: true, CheckOpeningPrnErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response, success } = data;
      set({ CheckOpeningPrnMsg: response, isOpenPrnsuccess: success ? 1 : 0 }); // Update state with fetched data
    } catch (error) {
      set({
        CheckOpeningPrnErr: error?.response?.data?.response,
        isOpenPrnsuccess: 0,
      }); // Handle errors
    }
    set({ isCheckOpeningPrnLoading: false });
  },
  ClearCheckOpeningPrn: () => {
    set({
      isCheckOpeningPrnLoading: false,
      CheckOpeningPrnErr: null,
      isOpenPrnsuccess: 0,
      CheckOpeningPrnMsg: "",
    });
  },
}));

export default useCheckOpeningPrn;
