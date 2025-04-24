import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/delcheck-openingprincipal`;
const useOpeningPrincipalDeleteCheck = create((set) => ({
  CheckOpeningPrincipalDeleteCheckMsg: "",
  isCheckOpeningPrincipalDeleteCheck: -1,
  isCheckOpeningPrincipalDeleteCheckLoading: false,
  CheckOpeningPrincipalDeleteCheckErr: null,

  CheckOpeningPrincipalDeleteCheck: async (userdata) => {
    set({
      isCheckOpeningPrincipalDeleteCheckLoading: true,
      CheckOpeningPrincipalDeleteCheckErr: null,
    }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      console.log(data, "my");
      const { response, success } = data;
      set({
        CheckOpeningPrincipalDeleteCheckMsg: response,
        isCheckOpeningPrincipalDeleteCheck: success ? 1 : 0,
      }); // Update state with fetched data
    } catch (error) {
      //    console.log(error?.response?.data?.response, "my");
      set({
        CheckOpeningPrincipalDeleteCheckErr: error?.response?.data?.response,
        isCheckOpeningPrincipalDeleteCheck: 0,
      }); // Handle errors
    }
    set({ isCheckOpeningPrincipalDeleteCheckLoading: false });
  },
  ClearCheckOpeningPrincipalDeleteCheck: () => {
    set({
      CheckOpeningPrincipalDeleteCheckMsg: "",
      isCheckOpeningPrincipalDeleteCheck: -1,
      isCheckOpeningPrincipalDeleteCheckLoading: false,
      CheckOpeningPrincipalDeleteCheckErr: null,
    });
  },
}));

export default useOpeningPrincipalDeleteCheck;
