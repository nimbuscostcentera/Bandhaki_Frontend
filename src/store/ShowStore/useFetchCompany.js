import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/company-list`;
const useFetchCompany = create((set) => ({
  CompanyList: [],
  isCompanyLoading: false,
  CompanyError: null,
  totalPages: 0,
  currentPage: 1,
  totalRecords: 0,

  fetchCompany: async (userdata) => {
    set({ isCompanyLoading: true, CompanyError: null }); // Start loading
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        CompanyList: response,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalRecords: data.totalRecords,
      }); // Update state with fetched data
    } catch (error) {
      set({ CompanyError: error.message }); // Handle errors
    }
    set({ isCompanyLoading: false });
  },
  clearCompanyList: () => {
    set({
      isCompanyLoading: false,
      CompanyError: null,
      totalPages: 0,
      currentPage: 1,
      totalRecords: 0,
    });
  },
}));

export default useFetchCompany;
