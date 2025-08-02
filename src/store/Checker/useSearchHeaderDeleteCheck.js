import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchheaderdeletecheck`;
const useSearchHeaderDeleteCheck = create((set) => ({
  SearchHeaderDeleteCheckMsg: "",
  isSearchHeaderDeleteCheck: -1,
  isSearchHeaderDeleteCheckLoading: false,
  SearchHeaderDeleteCheckErr: null,

  SearchHeaderDeleteCheck: async (userdata) => {
    try {
      set({ isSearchHeaderDeleteCheckLoading: true });
      const result = await axiosInstance.post(API, userdata);
      const { success, response } = result.data;

      set({
        isSearchHeaderDeleteCheck: success ? 1 : 0,
        SearchHeaderDeleteCheckMsg: response,
        SearchHeaderDeleteCheckErr: !success ? response : null,
      });
    } catch (error) {
      set({
        isSearchHeaderDeleteCheck: 0,
        SearchHeaderDeleteCheckErr:
          error.response?.data?.response || "Error checking deletion",
      });
    } finally {
      set({ isSearchHeaderDeleteCheckLoading: false });
    }
  },
  ClearSearchHeaderDeleteCheck: () => {
    set({
      isSearchHeaderDeleteCheckLoading: false,
      SearchHeaderDeleteCheckErr: null,
      isSearchHeaderDeleteCheck: -1,
    });
  },
}));

export default useSearchHeaderDeleteCheck;
