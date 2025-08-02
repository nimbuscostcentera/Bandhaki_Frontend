import { create } from "zustand";
// import axios from "axios";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchdetaildata`;

const useFetchSelectedSearchList = create((set) => ({
  SelectedSearchList: [],
  isSelectedSearchListSucc: false,
  isSelectedSearchListLoading: false,
  SelectedSearchListError: null,

  fetchSelectedSearchList: async (userdata) => {
    set({ isSelectedSearchListLoading: true, SelectedSearchListError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        SelectedSearchList: response,
        isSelectedSearchListLoading: false,
        isSelectedSearchListSucc: true,
      }); // Update SelectedSearchList with fetched data
    } catch (error) {
      set({
        SelectedSearchListError: error.message,
        isSelectedSearchListLoading: false,
      }); // Handle errors
    }
  },
  ClearStateSelectedSearchList: () =>
    set({
      SelectedSearchList: [],
      isSelectedSearchListSucc: false,
      isSelectedSearchListLoading: false,
      SelectedSearchListError: null,
    }),
}));

export default useFetchSelectedSearchList;
