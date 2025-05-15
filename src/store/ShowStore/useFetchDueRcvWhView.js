import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/view-creditamt`;

const useFetchDueRcvWhView = create((set) => ({
  DueRcvWhViewList: [],
  isDueRcvWhViewListLoading: false,
  isDueRcvWhViewListError: false,
  DueRcvWhViewErrMsg: "",

  fetchDueRcvWhViewHeader: async (userdata) => {
    set({ isDueRcvWhViewListLoading: true, isDueRcvWhViewListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        DueRcvWhViewList: data?.response,
        isDueRcvWhViewListLoading: false,
      });
    } catch (error) {
      set({
        DueRcvWhViewErrMsg: error?.response?.data?.response,
        isDueRcvWhViewListError: true,
        isDueRcvWhViewListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchDueRcvWhViewHeader: async (searchParams) => {
    set({ isDueRcvWhViewListLoading: true, isDueRcvWhViewListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        DueRcvWhViewList: data?.response,
        isDueRcvWhViewListLoading: false,
      });
    } catch (error) {
      set({
        isDueRcvWhViewListError: true,
        DueRcvWhViewErrMsg: error.response.data.response,
        isDueRcvWhViewListLoading: false,
      });
    }
  },

  ClearstateDueRcvWhViewList: async () => {
    set({
      isDueRcvWhViewListLoading: false,
      isDueRcvWhViewListError: false,
      DueRcvWhViewErrMsg: "",
      DueRcvWhViewList: [],
    });
  },
}));

export default useFetchDueRcvWhView;
