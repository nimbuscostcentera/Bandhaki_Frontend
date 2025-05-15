import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/admin-routes/update-credit_admin_setup`;
const useEditCredit = create((set) => ({
  CreditEditSuccess: null,
  isCreditEditLoading: false,
  CreditEditError: null,

  EditCreditFunc: async (userdata) => {
    set({
      isCreditEditLoading: true,
      CreditEditError: null,
      CreditEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;

      set({
        CreditEditSuccess: response,
        isCreditEditLoading: false,
        CreditEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CreditEditError: error?.response?.data?.response,
        isCreditEditLoading: false,
        CreditEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditCredit: () => {
    set({
      CreditEditSuccess: null,
      isCreditEditLoading: false,
      CreditEditError: null,
    });
  },
}));

export default useEditCredit;
