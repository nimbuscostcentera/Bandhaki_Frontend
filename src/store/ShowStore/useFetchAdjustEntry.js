import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/calculate`;
const useFetchAdjustEntry = create((set) => ({
  AdjustEntryList: [],
  isAdjustEntryLoading: false,
  AdjustEntryError: null,

  fetchAdjustEntry: async (userdata) => {
    set({ isAdjustEntryLoading: true, AdjustEntryError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ AdjustEntryList: response }); // Update state with fetched data
    } catch (error) {
      set({ AdjustEntryError: error.message }); // Handle errors
    }
    set({ isAdjustEntryLoading: false });
  },
  clearAdjustEntryList: () => {
    set({
      isAdjustEntryLoading: false,
      AdjustEntryError: null,
    });
  },
}));

export default useFetchAdjustEntry;
