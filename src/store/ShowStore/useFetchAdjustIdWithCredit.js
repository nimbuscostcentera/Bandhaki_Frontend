import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/get-creditwithid`;

const useFetchAdjustIdWithCredit = create((set) => ({
  GetAdjIdCreditViewList: [],
  isGetAdjIdCreditViewListLoading: false,
  isGetAdjIdCreditViewListError: false,
  GetAdjIdCreditViewErrMsg: "",

  fetchGetAdjIdCredit: async (userdata) => {
    set({ isGetAdjIdCreditViewListLoading: true, isGetAdjIdCreditViewListError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        GetAdjIdCreditViewList: data?.response,
        isGetAdjIdCreditViewListLoading: false,
      });
    } catch (error) {
      set({
        GetAdjIdCreditViewErrMsg: error?.response?.data?.response,
        isGetAdjIdCreditViewListError: true,
        isGetAdjIdCreditViewListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchGetAdjIdCredit: async (searchParams) => {
    set({ isGetAdjIdCreditViewListLoading: true, isGetAdjIdCreditViewListError: null });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        GetAdjIdCreditViewList: data?.response,
        isGetAdjIdCreditViewListLoading: false,
      });
    } catch (error) {
      set({
        isGetAdjIdCreditViewListError: true,
        GetAdjIdCreditViewErrMsg: error?.response?.data?.response,
        isGetAdjIdCreditViewListLoading: false,
      });
    }
  },

  ClearstateGetAdjIdCredit: async () => {
    set({
      isGetAdjIdCreditViewListLoading: false,
      isGetAdjIdCreditViewListError: false,
      GetAdjIdCreditViewErrMsg: "",
      GetAdjIdCreditViewList: [],
    });
  },
}));

export default useFetchAdjustIdWithCredit;
