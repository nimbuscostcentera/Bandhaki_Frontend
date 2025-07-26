import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/report-show`;

const useFetchTransReport = create((set) => ({
  TransReport: [],
  AdvanceReport: [],
  OutStandingReport:[],
  isTransReportLoading: false,
  isTransReportError: false,
  TransReportErrMsg: "",
  isTransReportSucc: false,

  fetchTransReport: async (userdata) => {
    set({ isTransReportLoading: true});
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;

      set({
        isTransReportSucc: true,
        TransReport: data?.response,
        AdvanceReport: data?.response2,
        OutStandingReport: data?.response3,
        isTransReportLoading: false,
      });
        
    } catch (error) {
      set({
        TransReportErrMsg: error?.response?.data?.response,
        isTransReportError: true,
        isTransReportLoading: false,
      });
    }
  },
    ClearstateTransReport: async () => {
      set({
      isTransReportSucc:false,
      isTransReportLoading: false,
      isTransReportError: false,
      TransReportErrMsg: "",
    });
  },
}));

export default useFetchTransReport;
