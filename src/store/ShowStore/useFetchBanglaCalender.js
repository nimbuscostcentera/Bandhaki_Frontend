import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/bangla-calender`;
const useFetchBanglaCalender = create((set) => ({
  BanglaCalenderList: [],
  isBanglaCalenderLoading: false,
  BanglaCalenderError: null,

  fetchBanglaCalender: async (userdata) => {
    set({ isBanglaCalenderLoading: true, BanglaCalenderError: null }); // Start loading
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({
        BanglaCalenderList: response,
      }); // Update state with fetched data
    } catch (error) {
      set({ BanglaCalenderError: error.message }); // Handle errors
    }
    set({ isBanglaCalenderLoading: false });
  },
  clearBanglaCalenderList: () => {
    set({
      isBanglaCalenderLoading: false,
      BanglaCalenderError: null,
    });
  },
}));

export default useFetchBanglaCalender;
