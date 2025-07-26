import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
// let API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingheaders-show`;

const useFetchOpeningEntryHeader = create((set) => ({
  EntryList: [],
  pagination: {
    totalPages: 0,
    currentPage: 0,
    totalRecords: 0,
    limit: 10,
  },
  isEntryListLoading: false,
  isEntryListError: null,

  fetchOpeningEntryHeader: async (userdata) => {
    set({ isEntryListLoading: true, isEntryListError: null });
    try {
      const endpoint =
        userdata?.Cust_Type == 3
          ? `${process.env.REACT_APP_BASEURL}/transaction-routes/mahajonopeningheaders-show`
          : `${process.env.REACT_APP_BASEURL}/transaction-routes/openingheaders-show`;
      const result = await axiosInstance.post(endpoint, userdata);
      const { data } = result;

      set({
        EntryList: data?.data,
        pagination: {
          totalPages: data?.totalPages,
          currentPage: data?.currentPage,
          totalRecords: data?.totalRecords,
          limit: userdata.limit || 10,
        },
        isEntryListLoading: false,
      });
    } catch (error) {
      set({
        isEntryListError: error.message,
        isEntryListLoading: false,
      });
    }
  },

  // This function handles both regular fetching and searching
  // The API already supports searching via the keyword parameter
  searchOpeningEntryHeader: async (searchParams) => {
    set({ isEntryListLoading: true, isEntryListError: null });
    try {
      const endpoint =
        searchParams?.Cust_Type == 3
          ? `${process.env.REACT_APP_BASEURL}/transaction-routes/mahajonopeningheaders-show`
          : `${process.env.REACT_APP_BASEURL}/transaction-routes/openingheaders-show`;
      const result = await axiosInstance.post(endpoint, searchParams);
      const { data } = result;

      set({
        EntryList: data?.data,
        pagination: {
          totalPages: data?.totalPages,
          currentPage: data?.currentPage,
          totalRecords: data?.totalRecords,
          limit: searchParams.limit || 10,
        },
        isEntryListLoading: false,
      });
    } catch (error) {
      set({
        isEntryListError: error?.response?.data?.response,
        isEntryListLoading: false,
      });
    }
  },

  ClearstateEntryList: async () => {
    set({
      isEntryListLoading: false,
      isEntryListError: null,
    });
  },
}));

export default useFetchOpeningEntryHeader;
