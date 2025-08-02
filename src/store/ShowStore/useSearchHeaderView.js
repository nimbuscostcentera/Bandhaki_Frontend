import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchheadershow`;

const useSearchHeaderView = create((set) => ({
  DueSearchHeaderViewList: [],
  isDueSearchHeaderViewListLoading: false,
  isDueSearchHeaderViewListError: false,
  DueSearchHeaderViewErrMsg: "",

  fetchDueSearchHeaderViewHeader: async (userdata) => {
    set({ isDueSearchHeaderViewListLoading: true, isDueSearchHeaderViewListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        DueSearchHeaderViewList: data?.response,
        isDueSearchHeaderViewListLoading: false,
      });
    } catch (error) {
      set({
        DueSearchHeaderViewErrMsg: error?.response?.data?.response,
        isDueSearchHeaderViewListError: true,
        isDueSearchHeaderViewListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchDueSearchHeaderViewHeader: async (searchParams) => {
    set({ isDueSearchHeaderViewListLoading: true, isDueSearchHeaderViewListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        DueSearchHeaderViewList: data?.response,
        isDueSearchHeaderViewListLoading: false,
      });
    } catch (error) {
      set({
        isDueSearchHeaderViewListError: true,
        DueSearchHeaderViewErrMsg: error.response.data.response,
        isDueSearchHeaderViewListLoading: false,
      });
    }
  },

  ClearstateDueSearchHeaderViewList: async () => {
    set({
      isDueSearchHeaderViewListLoading: false,
      isDueSearchHeaderViewListError: false,
      DueSearchHeaderViewErrMsg: "",
      DueSearchHeaderViewList: [],
    });
  },
}));

export default useSearchHeaderView;
