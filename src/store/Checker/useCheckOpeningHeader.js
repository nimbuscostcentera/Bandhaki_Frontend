import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/editcheck-openingheader`;
const useCheckOpeningHeader = create((set) => ({
  CheckOpeningHeaderMsg: "",
  isCheckOpHeader:-1,
  isCheckOpeningHeaderLoading: false,
  CheckOpeningHeaderErr: null,

  CheckOpeningHeader: async (userdata) => {
    set({ isCheckOpeningHeaderLoading: true, CheckOpeningHeaderErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      console.log(data, "my");
      const { response, success } = data;
      set({
        CheckOpeningHeaderMsg: response,
        isCheckOpHeader: success ? 1:0,
      }); // Update state with fetched data
    } catch (error) {
    //    console.log(error?.response?.data?.response, "my");
      set({ CheckOpeningHeaderErr: error?.response?.data?.response ,isCheckOpHeader:0}); // Handle errors
    }
    set({ isCheckOpeningHeaderLoading: false });
  },
  ClearCheckOpeningHeader: () => {
    set({
      isCheckOpeningHeaderLoading: false,
      CheckOpeningHeaderErr: null,
      isCheckOpHeader: -1,
      CheckOpeningHeaderMsg:"",
    });
  },
}));

export default useCheckOpeningHeader;
