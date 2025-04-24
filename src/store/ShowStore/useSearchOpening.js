import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingentry-search`;
const useSearchOpening = create((set) => ({
  OpeningSearchResult: [],
  pageoptions: {
    totalOpeningSearchRecords: 0,
    totalOpeningSearchPages: 0,
    OpeningSearchCurrentPage: 0,
  },
  isOpeningSearchSuccess: false,
  isOpeningSearchLoading: false,
  OpeningSearchError: null,

  SearchOpeningData: async (userdata) => {
    set({ isOpeningSearchLoading: true, error: null }); // Start isOpeningSearchLoading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { totalRecords, totalPages, currentPage } = result;
      const { data } = result;
      const { response } = data;
      set({
        OpeningSearchResult: response,
        isOpeningSearchSuccess: true,
        pageoptions: {
          totalOpeningSearchRecords: totalRecords,
          totalOpeningSearchPages: totalPages,
          OpeningSearchCurrentPage: currentPage,
        },
      }); // Update state with Searched data
    } catch (error) {
      set({ OpeningSearchError: error.message }); // Handle errors
    }
    set({ isOpeningSearchLoading: false });
  },
  ClearSearchOpeningEntry: async () => {
    set({
      isOpeningSearchSuccess: false,
      isOpeningSearchLoading: false,
      OpeningSearchError: null,
      OpeningSearchResult: [],
      pageoptions: {
        totalOpeningSearchRecords: 0,
        totalOpeningSearchPages: 0,
        OpeningSearchCurrentPage: 0,
      },
    });
  },
}));

export default useSearchOpening;
