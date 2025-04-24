import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/company-add`;
const useAddCompany = create((set) => ({
  CompanyRegSuccess: null,
  isCompanyRegLoading: false,
  CompanyRegError: null,

 CompanyReg: async (userdata) => {
    set({
      isCompanyRegLoading: true,
      CompanyRegError: null,
      CompanyRegSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
        console.log(response);
      set({ CompanyRegSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CompanyRegError: error?.response?.data?.response,
        CompanyRegSuccess: null,
      }); // Handle errors
    } finally {
      set({ isCompanyRegLoading: false });
    }
  },
  ClearStateCompanyAdd: () => {
    set({ CompanyRegSuccess: null, isCompanyRegLoading: false, CompanyRegError: null });
  },
}));

export default useAddCompany;
