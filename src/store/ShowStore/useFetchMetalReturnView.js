import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/metal-listview`;

const useFetchMetalReturnView = create((set) => ({
  MetalReturnList: [],
  isMetalReturnListLoading: false,
  isMetalReturnListError: false,
  MetalReturnErrMsg: "",

  fetchMetalReturnHeader: async (userdata) => {
    set({ isMetalReturnListLoading: true, isMetalReturnListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        MetalReturnList: data?.response,
        isMetalReturnListLoading: false,
      });
    } catch (error) {
      set({
        MetalReturnErrMsg: error.response.data.response,
        isMetalReturnListError: true,
        isMetalReturnListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchMetalReturnHeader: async (searchParams) => {
    set({ isMetalReturnListLoading: true, isMetalReturnListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        MetalReturnList: data?.response,
        isMetalReturnListLoading: false,
      });
    } catch (error) {
      set({
        isMetalReturnListError: true,
        MetalReturnErrMsg: error.response.data.response,
        isMetalReturnListLoading: false,
      });
    }
  },

  ClearstateMetalReturnList: async () => {
    set({
      isMetalReturnListLoading: false,
      isMetalReturnListError: false,
      MetalReturnErrMsg: "",
      MetalReturnList: [],
    });
  },
}));

export default useFetchMetalReturnView;
