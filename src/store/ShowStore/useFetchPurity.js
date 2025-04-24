import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `/data-routes/purity-list`;
const useFetchPurity = create((set) => ({
  PurityList: [],
  isPurityLoading: false,
  PurityError: null,

  fetchPurityMaster: async (userdata) => {
    set({ isPurityLoading: true, PurityError: null }); // Start loading
    try {
      console.log(userdata);
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ PurityList: response, isPurityLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ PurityError: error.message, isPurityLoading: false }); // Handle errors
    }
  },
  ClearStatePurity: () => {
    set({ isPurityLoading: false, PurityError: null });
  },
}));

export default useFetchPurity;
