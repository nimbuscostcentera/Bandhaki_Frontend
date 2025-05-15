import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/checkedit-openingprincipal`;
const useCheckOpeningPrn = create((set) => ({
  CheckOpeningPrnMsg: "",
  isCheckOpHeader: -1,
  isCheckOpeningPrnLoading: false,
  CheckOpeningPrnErr: null,

  CheckOpeningPrn: async (userdata) => {
    set({ isCheckOpeningPrnLoading: true, CheckOpeningPrnErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response, success } = data;
      set({ CheckOpeningPrnMsg: response, isCheckOpHeader: success ? 1 : 0 }); // Update state with fetched data
    } catch (error) {
      console.log(error?.response?.data?.response, "my");
      set({
        CheckOpeningPrnErr: error?.response?.data?.response,
        isCheckOpHeader: 0,
      }); // Handle errors
    }
    set({ isCheckOpeningPrnLoading: false });
  },
  ClearCheckOpeningPrn: () => {
    set({
      isCheckOpeningPrnLoading: false,
      CheckOpeningPrnErr: null,
      isCheckOpHeader: -1,
      CheckOpeningPrnMsg: "",
    });
  },
}));

export default useCheckOpeningPrn;
