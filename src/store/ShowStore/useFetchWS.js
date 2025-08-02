import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/wholeseller-list`;
const useFetchWS = create((set) => ({
  WholeSellerList: [],
  isLoadingWSList: false,
  errorWSList: null,
  isWsSuccess: false,

  fetchWSomrData: async (userdata) => {
    set({ isLoadingWSList: true, error: null }); // Start isLoadingWSList
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ WholeSellerList: response, isWsSuccess: true }); // Update state with fetched data
    } catch (error) {
      set({ errorWSList: error?.response?.data?.response }); // Handle errors
    }
    set({ isLoadingWSList: false });
  },
  ClearWSList: () =>
    set({ isLoadingWSList: false, errorWSList: null, isWsSuccess: false }),
}));

export default useFetchWS;
