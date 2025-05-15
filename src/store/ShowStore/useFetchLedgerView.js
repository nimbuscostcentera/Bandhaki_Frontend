import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/c_t_ledget-view`;

const useFetchLedgerView = create((set) => ({
  LedgerViewList: [],
  isLedgerViewListLoading: false,
  isLedgerViewListError: false,
  LedgerViewErrMsg: "",

  fetchLedgerViewHeader: async (userdata) => {
    set({ isLedgerViewListLoading: true, isLedgerViewListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        LedgerViewList: data?.response,
        isLedgerViewListLoading: false,
      });
    } catch (error) {
      set({
        LedgerViewErrMsg: error?.response?.data?.response,
        isLedgerViewListError: true,
        isLedgerViewListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchLedgerViewHeader: async (searchParams) => {
    set({ isLedgerViewListLoading: true, isLedgerViewListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        LedgerViewList: data?.response,
        isLedgerViewListLoading: false,
      });
    } catch (error) {
      set({
        isLedgerViewListError: true,
        LedgerViewErrMsg: error?.response?.data?.response,
        isLedgerViewListLoading: false,
      });
    }
  },

  ClearstateLedgerViewList: async () => {
    set({
      isLedgerViewListLoading: false,
      isLedgerViewListError: false,
      LedgerViewErrMsg: "",
      LedgerViewList: [],
    });
  },
}));

export default useFetchLedgerView;
