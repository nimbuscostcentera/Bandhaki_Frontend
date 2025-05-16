import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/mahajan-list`;
const useFetchMahajon = create((set) => ({
  MahajonList: [],
  isLoadingMahajon: false,
  errorMahajon: null,

  fetchMahajonData: async (userdata) => {
    set({ isLoadingMahajon: true, error: null }); // Start isLoadingMahajon
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ MahajonList: response }); // Update state with fetched data
    } catch (error) {
      set({ errorMahajon: error.message }); // Handle errors
    }
    set({ isLoadingMahajon: false });
  },
  ClearMahajonList: () => set({ isLoadingMahajon: false, errorMahajon: null }),
}));

export default useFetchMahajon;
