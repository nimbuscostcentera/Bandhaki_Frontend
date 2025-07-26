import { create } from "zustand";
// import axios from "axios";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchforadjust`;

const useFetchSearchFrAdjust = create((set) => ({
  SearchFrAdjustList: [],
  isSearchFrAdjustSucc: false,
  isSearchFrAdjustLoading: false,
  SearchFrAdjustError: null,

  fetchSearchFrAdjustMaster: async (userdata) => {
    set({ isSearchFrAdjustLoading: true, SearchFrAdjustError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        SearchFrAdjustList: response,
        isSearchFrAdjustLoading: false,
        isSearchFrAdjustSucc: true,
      }); // Update SearchFrAdjust with fetched data
    } catch (error) {
      set({
        SearchFrAdjustError: error.message,
        isSearchFrAdjustLoading: false,
      }); // Handle errors
    }
  },
  ClearStateSearchFrAdjust: () =>
    set({
      SearchFrAdjustList: [],
      isSearchFrAdjustSucc: false,
      isSearchFrAdjustLoading: false,
      SearchFrAdjustError: null,
    }),
}));

export default useFetchSearchFrAdjust;
