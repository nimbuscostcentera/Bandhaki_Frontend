import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `/transfer-routes/searchdata`;
const useFetchSearchDafa = create((set) => ({
  SearchDafaList: [],
  isSearchDafaLoading: false,
  SearchDafaError: null,
  isSearchDafaSuccess: false,
  fetchSearchDafaMaster: async (userdata) => {
    set({ isSearchDafaLoading: true, SearchDafaError: null }); // Start loading
    try {
      console.log(userdata);
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        SearchDafaList: response,
        isSearchDafaLoading: false,
        isSearchDafaSuccess: true,
      }); // Update state with fetched data
    } catch (error) {
      set({
        SearchDafaError: error?.response?.data?.response,
        isSearchDafaLoading: false,
        SearchDafaList: [],
      }); // Handle errors
    }
  },
  ClearStateSearchDafa: () => {
    set({
      SearchDafaList: [],
      isSearchDafaLoading: false,
      SearchDafaError: null,
      isSearchDafaSuccess: false,
    });
  },
}));

export default useFetchSearchDafa;
