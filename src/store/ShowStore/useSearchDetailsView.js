import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/searchdetailshow`;

const useSearchDetailsView = create((set) => ({
  SearchDetailsViewList: [],
  isSearchDetailsViewListLoading: false,
    isSearchDetailsViewListError: false,
    isSearchDetailListSuccess: false,
  SearchDetailsViewErrMsg: "",

  fetchSearchDetailsViewDetails: async (userdata) => {
    set({
      isSearchDetailsViewListLoading: true,
      isSearchDetailsViewListError: null,
    });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        SearchDetailsViewList: data?.response,
        isSearchDetailsViewListLoading: false,
        isSearchDetailListSuccess: true,
      });
    } catch (error) {
      set({
        SearchDetailsViewErrMsg: error?.response?.data?.response,
        isSearchDetailsViewListError: true,
        isSearchDetailsViewListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchSearchDetailsViewDetails: async (searchParams) => {
    set({
      isSearchDetailsViewListLoading: true,
      isSearchDetailsViewListError: null,
    });
    try {
      const result = await axiosInstance.post(API, searchParams);
      const { data } = result;
      set({
        SearchDetailsViewList: data?.response,
        isSearchDetailsViewListLoading: false,
        isSearchDetailListSuccess: true,
      });
    } catch (error) {
      set({
        isSearchDetailsViewListError: true,
        SearchDetailsViewErrMsg: error.response.data.response,
        isSearchDetailsViewListLoading: false,
      });
    }
  },

  ClearstateSearchDetailsViewList: async () => {
    set({
      isSearchDetailsViewListLoading: false,
      isSearchDetailsViewListError: false,
      SearchDetailsViewErrMsg: "",
      SearchDetailsViewList: [],
      isSearchDetailListSuccess: false,
    });
  },
}));

export default useSearchDetailsView;
