import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/adjust-header-show`;

const useFetchAdjustEntryHeader = create((set) => ({
  AdjustEntryList: [],
  isAdjustEntryListLoading: false,
  isAdjustEntryListError: false,
  AdjustEntryErrMsg:"",

  fetchAdjustEntryHeader: async (userdata) => {
    set({ isAdjustEntryListLoading: true, isAdjustEntryListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        AdjustEntryList: data?.response,
        isAdjustEntryListLoading: false,
      });
    } catch (error) {
      set({
        AdjustEntryErrMsg: error.response.data.response,
        isAdjustEntryListError:true,
        isAdjustEntryListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchAdjustEntryHeader: async (searchParams) => {
    set({ isAdjustEntryListLoading: true, isAdjustEntryListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        AdjustEntryList: data?.response,
        isAdjustEntryListLoading: false,
      });
    } catch (error) {
      set({
        isAdjustEntryListError: true,
        AdjustEntryErrMsg: error.response.data.response,
        isAdjustEntryListLoading: false,
      });
    }
  },

  ClearstateAdjustEntryList: async () => {
    set({
      isAdjustEntryListLoading: false,
      isAdjustEntryListError: false,
      AdjustEntryErrMsg: "",
      AdjustEntryList: [],
    });
  },
}));

export default useFetchAdjustEntryHeader;
