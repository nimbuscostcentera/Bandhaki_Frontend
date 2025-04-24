import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/goldrate-edit`;
const useEditGoldRate = create((set) => ({
  GoldRateEditSuccess: null,
  isGoldRateEditLoading: false,
  GoldRateEditError: null,

  EditGoldRateFunc: async (userdata) => {
    set({
      isGoldRateEditLoading: true,
      GoldRateEditError: null,
      GoldRateEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        GoldRateEditSuccess: response,
        isGoldRateEditLoading: false,
        GoldRateEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GoldRateEditError: error?.response?.data?.response,
        isGoldRateEditLoading: false,
        GoldRateEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditGoldRate: () => {
    set({
      GoldRateEditSuccess: null,
      isGoldRateEditLoading: false,
      GoldRateEditError: null,
    });
  },
}));

export default useEditGoldRate;
