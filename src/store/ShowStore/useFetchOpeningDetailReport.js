import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingdetailbyid-show`;

const useFetchOpeningDetailReport = create((set) => ({
  isOpeningDetailListSuccess:false,
  OpeningDetailList: [],
  pagination: {
    totalPages: 0,
    currentPage: 0,
    totalRecords: 0,
  },
  isOpeningDetailLoading: false,
  isOpeningDetailError: false,
  OpnDetailErrMsg:"",

  fetchOpeningDetail: async (userdata) => {
    set({ isOpeningDetailLoading: true, isOpeningDetailError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      set({
        isOpeningDetailListSuccess: true,
        OpeningDetailList: data?.data,
        pagination: {
          totalPages: data?.totalPages,
          currentPage: data?.currentPage,
          totalRecords: data?.totalRecords,
        },
        isOpeningDetailLoading: false,
      });
    } catch (error) {
      set({
        isOpeningDetailError: true,
        OpnDetailErrMsg:error.response.data.response,
        isOpeningDetailLoading: false,
      });
    }
  },
  ClearstateOpeningDetailList:() => {
    set({
      isOpeningDetailLoading: false,
      isOpeningDetailError: false,
      OpnDetailErrMsg: "",
      isOpeningDetailListSuccess: false,
    });
  },
}));

export default useFetchOpeningDetailReport;
