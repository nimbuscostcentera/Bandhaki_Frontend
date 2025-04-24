import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/delcheck-adjustvoucher`;
const useAdjustDeleteCheck = create((set) => ({
  CheckAdjustDeleteCheckMsg: "",
  isCheckAdjustDeleteCheck: 0,
  isCheckAdjustDeleteCheckLoading: false,
  CheckAdjustDeleteCheckErr: null,

  CheckAdjustDeleteCheck: async (userdata) => {
    set({
      isCheckAdjustDeleteCheckLoading: true,
      CheckAdjustDeleteCheckErr: null,
    }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      console.log(data, "my");
      const { response, success } = data;
      set({
        CheckAdjustDeleteCheckMsg: response,
        isCheckAdjustDeleteCheck: success ? 1 : 0,
      }); // Update state with fetched data
    } catch (error) {
      //    console.log(error?.response?.data?.response, "my");
      set({
        CheckAdjustDeleteCheckErr: error?.response?.data?.response,
        isCheckAdjustDeleteCheck: 2,
      }); // Handle errors
    }
    set({ isCheckAdjustDeleteCheckLoading: false });
  },
  ClearCheckAdjustDeleteCheck: () => {
    set({
      isCheckAdjustDeleteCheckLoading: false,
      CheckAdjustDeleteCheckErr: null,
      isCheckAdjustDeleteCheck: 0,
    });
  },
}));

export default useAdjustDeleteCheck;
