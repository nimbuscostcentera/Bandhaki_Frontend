import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/company-edit`;
const useEditCompany = create((set) => ({
  CompanyEditSuccess: null,
  isCompanyEditLoading: false,
  CompanyEditError: null,

  EditCompanyFunc: async (userdata) => {
    set({
      isCompanyEditLoading: true,
      CompanyEditError: null,
      CompanyEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        CompanyEditSuccess: response,
        isCompanyEditLoading: false,
        CompanyEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CompanyEditError: error?.response?.data?.response,
        isCompanyEditLoading: false,
        CompanyEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditCompany: () => {
    set({
      CompanyEditSuccess: null,
      isCompanyEditLoading: false,
      CompanyEditError: null,
    });
  },
}));

export default useEditCompany;
