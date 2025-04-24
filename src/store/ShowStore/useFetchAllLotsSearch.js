import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/all-lot-list`;
const useFetchAllLotsSearch = create((set) => ({
  AllLotsSearchList: [],
  isLoadingAllLotsSearch: false,
  errorAllLotsSearch: null,

  fetchLotsSearchList: async (userdata) => {
    set({ isLoadingAllLotsSearch: true, error: null }); // Start isLoadingAllLotsSearch
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ AllLotsSearchList: response }); // Update state with fetched data
    } catch (error) {
      set({ errorAllLotsSearch: error.message }); // Handle errors
    }
    set({ isLoadingAllLotsSearch: false });
  },
  ClearAllLotsSearchList: () =>{set({ isLoadingAllLotsSearch: false, errorAllLotsSearch: null })}
}));

export default useFetchAllLotsSearch;
