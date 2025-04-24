import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/goldrate-list`;
const useFetchGoldRate = create((set) => ({
  GoldRateList: [],
  isGoldRateLoading: false,
  GoldRateError: null,

  fetchGoldRate: async (userdata) => {
    set({ isGoldRateLoading: true, GoldRateError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ GoldRateList: response }); // Update state with fetched data
    } catch (error) {
      set({ GoldRateError: error.message }); // Handle errors
    }
    set({ isGoldRateLoading: false });
  },
  clearGoldRateList: () => {
    set({
      isGoldRateLoading: false,
      GoldRateError: null,
    });
  },
}));

export default useFetchGoldRate;
