import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/bangla-month`;
const useFetchBanglaMonth = create((set) => ({
  BanglaMonthList: [],
  isBanglaMonthLoading: false,
  BanglaMonthError: null,
  fetchBanglaMonth: async (userdata) => {
    set({ isBanglaMonthLoading: true, BanglaMonthError: null }); // Start loading
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        BanglaMonthList: response,
      }); // Update state with fetched data
    } catch (error) {
      set({ BanglaMonthError: error.message }); // Handle errors
    }
    set({ isBanglaMonthLoading: false });
  },
  clearBanglaMonthList: () => {
    set({
      isBanglaMonthLoading: false,
      BanglaMonthError: null,
    });
  },
}));

export default useFetchBanglaMonth;
