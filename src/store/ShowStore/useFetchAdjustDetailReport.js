import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/adjust-detail-show`;

const useFetchAdjustDetailReport = create((set) => ({
  isAdjustDetailListSuccess:false,
  AdjustDetailList: [],
  isAdjustDetailLoading: false,
  isAdjustDetailError: null,

  fetchAdjustDetail: async (userdata) => {
    set({ isAdjustDetailLoading: true, isAdjustDetailError: null });
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      set({
        isAdjustDetailListSuccess: true,
        AdjustDetailList: data?.response,
        isAdjustDetailLoading: false,
      });
    } catch (error) {
      set({
        isAdjustDetailError: error.message,
        isAdjustDetailLoading: false,
      });
    }
  },
  ClearstateAdjustDetailList: async () => {
    set({
      isAdjustDetailLoading: false,
      isAdjustDetailError: null,
    });
  },
}));

export default useFetchAdjustDetailReport;
