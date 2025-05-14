import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/show-creditrecwh`;

const useFetchDueRcvWh = create((set) => ({
  DueRcvwhList: [],
  isDueRcvwhListLoading: false,
  isDueRcvwhListError: false,
  DueRcvwhErrMsg: "",

  fetchDueRcvwhHeader: async (userdata) => {
    set({ isDueRcvwhListLoading: true, isDueRcvwhListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        DueRcvwhList: data?.response,
        isDueRcvwhListLoading: false,
      });
    } catch (error) {
      set({
        DueRcvwhErrMsg: error?.response?.data?.response,
        isDueRcvwhListError: true,
        isDueRcvwhListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchDueRcvwhHeader: async (searchParams) => {
    set({ isDueRcvwhListLoading: true, isDueRcvwhListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        DueRcvwhList: data?.response,
        isDueRcvwhListLoading: false,
      });
    } catch (error) {
      set({
        isDueRcvwhListError: true,
        DueRcvwhErrMsg: error.response.data.response,
        isDueRcvwhListLoading: false,
      });
    }
  },

  ClearstateDueRcvwhList: async () => {
    set({
      isDueRcvwhListLoading: false,
      isDueRcvwhListError: false,
      DueRcvwhErrMsg: "",
      DueRcvwhList: [],
    });
  },
}));

export default useFetchDueRcvWh;
