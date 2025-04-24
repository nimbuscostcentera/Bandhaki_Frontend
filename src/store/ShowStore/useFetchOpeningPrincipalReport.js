import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingprincipalbyid-show`;

const useFetchOpeningPrincipalReport = create((set) => ({
  isOpeningPrincipalListSuccess: false,
  OpeningPrincipalList: [],
  isOpeningPrincipalLoading: false,
  OpenPrnDelErrMsg:"",
  isOpeningPrincipalError: false,

  fetchOpeningPrincipal: async (userdata) => {
    set({ isOpeningPrincipalLoading: true, isOpeningPrincipalError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
        const { data } = result;
       
      set({
        isOpeningPrincipalListSuccess: true,
        OpeningPrincipalList: data?.response,
        isOpeningPrincipalLoading: false,
      });
    } catch (error) {
      set({
        OpenPrnDelErrMsg:error.response.data.response,
        isOpeningPrincipalError:true,
        isOpeningPrincipalLoading: false,
      });
    }
  },
  ClearstateOpeningPrincipalList: async () => {
    set({
      isOpeningPrincipalLoading: false,
      isOpeningPrincipalError: false,
      isOpeningPrincipalListSuccess: false,
      OpenPrnDelErrMsg:"",
    });
  },
}));

export default useFetchOpeningPrincipalReport;
