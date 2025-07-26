import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchdetaildelete`;
const useSearchDetailDelete = create((set) => ({
  SearchDetailDeleteMsg: "",
  isSearchDetailDeleteLoading: false,
  SearchDetailDeleteErr: null,
  isSearchDetailDeleteSucc: false,
  DeleteSearchDetail: async (userdata) => {
    set({ isSearchDetailDeleteLoading: true, SearchDetailDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ SearchDetailDeleteMsg: response, isSearchDetailDeleteSucc: true }); // Update state with fetched data
    } catch (error) {
      set({ SearchDetailDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isSearchDetailDeleteLoading: false });
  },
  ClearSearchDetailDelete: () => {
    set({
      isSearchDetailDeleteLoading: false,
      SearchDetailDeleteErr: null,
      SearchDetailDeleteMsg: "",
    });
  },
}));

export default useSearchDetailDelete;
