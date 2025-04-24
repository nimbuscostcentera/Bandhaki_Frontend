import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/goldrate-add`;
const useAddGoldRate = create((set) => ({
  GoldRateSuccess: null,
  isGoldRateLoading: false,
  GoldRateError: null,

  addGoldRate: async (userdata) => {
    set({
      isGoldRateLoading: true,
      GoldRateError: null,
      GoldRateSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ GoldRateSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GoldRateError: error?.response?.data?.response,
        GoldRateSuccess: null,
      }); // Handle errors
    } finally {
      set({ isGoldRateLoading: false });
    }
  },
  ClearStateGoldRateAdd: () => {
    set({
      GoldRateSuccess: null,
      isGoldRateLoading: false,
      GoldRateError: null,
    });
  },
}));

export default useAddGoldRate;
