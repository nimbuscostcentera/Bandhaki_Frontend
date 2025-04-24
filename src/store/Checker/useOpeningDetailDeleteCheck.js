import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/delcheck-openingdetail`;
const useOpeningDetailDeleteCheck = create((set) => ({
  CheckOpeningDetailDeleteCheckMsg: "",
  isCheckOpeningDetailDeleteCheck: -1,
  
  isCheckOpeningDetailDeleteCheckLoading: false,
  CheckOpeningDetailDeleteCheckErr: null,

  CheckOpeningDetailDeleteCheck: async (userdata) => {
    set({
      isCheckOpeningDetailDeleteCheckLoading: true,
      CheckOpeningDetailDeleteCheckErr: null,
    }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      console.log(data, "my");
      const { response, success } = data;
      set({
        CheckOpeningDetailDeleteCheckMsg: response,
        isCheckOpeningDetailDeleteCheck: success ? 1 : 0,
      }); // Update state with fetched data
    } catch (error) {
      //    console.log(error?.response?.data?.response, "my");
      set({
        CheckOpeningDetailDeleteCheckErr: error?.response?.data?.response,
        isCheckOpeningDetailDeleteCheck: 0,
      }); // Handle errors
    }
    set({ isCheckOpeningDetailDeleteCheckLoading: false });
  },
  ClearCheckOpeningDetailDeleteCheck: () => {
    set({
      isCheckOpeningDetailDeleteCheckLoading: false,
      CheckOpeningDetailDeleteCheckErr: null,
      isCheckOpeningDetailDeleteCheck: -1,
    });
  },
}));

export default useOpeningDetailDeleteCheck;
