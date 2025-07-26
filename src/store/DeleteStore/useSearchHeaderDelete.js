import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchheaderdelete`;
const useSearchHeaderDelete = create((set) => ({
  SearchHeaderDeleteMsg: "",
  isSearchHeaderDeleteSucc: false,
  isSearchHeaderDeleteLoading: false,
  SearchHeaderDeleteErr: null,

  DeleteSearchHeader: async (userdata) => {
    set({ isSearchHeaderDeleteLoading: true, SearchHeaderDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ SearchHeaderDeleteMsg: response, isSearchHeaderDeleteSucc: true }); // Update state with fetched data
    } catch (error) {
      set({ SearchHeaderDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isSearchHeaderDeleteLoading: false });
  },
  ClearSearchHeaderDelete: () => {
    set({
      isSearchHeaderDeleteLoading: false,
      SearchHeaderDeleteErr: null,
      SearchHeaderDeleteMsg: "",
      isSearchHeaderDeleteSucc: false,
    });
  },
}));

export default useSearchHeaderDelete;
