import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchdetaildeletecheck`;
const useSearchDetailsDeleteCheck = create((set) => ({
  SearchDetailsDeleteCheckMsg: "",
  isSearchDetailsDeleteCheck: -1,
  isSearchDetailsDeleteCheckLoading: false,
  SearchDetailsDeleteCheckErr: null,

  SearchDetailsDeleteCheck: async (userdata) => {
    try {
      set({ isSearchDetailsDeleteCheckLoading: true });
      const result = await axiosInstance.post(API, userdata);
      console.log(result,"result")
      const { success, response } = result.data;
      console.log(success,"success")

      set({
        isSearchDetailsDeleteCheck: success ? 1 : 0,
        SearchDetailsDeleteCheckMsg: response,
        SearchDetailsDeleteCheckErr: !success ? response : null,
      });
    } catch (error) {
      set({
        isSearchDetailsDeleteCheck: 0,
        SearchDetailsDeleteCheckErr:
          error.response?.data?.response || "Error checking deletion",
      });
    } finally {
      set({ isSearchDetailsDeleteCheckLoading: false });
    }
  },
  ClearSearchDetailsDeleteCheck: () => {
    set({
      isSearchDetailsDeleteCheckLoading: false,
      SearchDetailsDeleteCheckErr: null,
      isSearchDetailsDeleteCheck: -1,
    });
  },
}));

export default useSearchDetailsDeleteCheck;
