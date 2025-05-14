import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/admin-routes/get-timing_table `;
const useFetchTiming = create((set) => ({
  TimingList: [],
  isTimingLoading: false,
  TimingError: null,

  fetchTimingMaster: async (userdata) => {
    set({ isTimingLoading: true, TimingError: null }); // Start loading
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ TimingList: response, isTimingLoading: false }); // Update Timing with fetched data
    } catch (error) {
      set({ TimingError: error.message, isTimingLoading: false }); // Handle errors
    }
  },
  ClearTimingList: () => {
    set({
      isTimingLoading: false,
      TimingError: null,
      TimingList: []
    });
  },
}));

export default useFetchTiming;
