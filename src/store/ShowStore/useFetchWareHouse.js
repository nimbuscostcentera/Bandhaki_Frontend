import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/WareHouse-list`;
const useFetchWareHouse = create((set) => ({
  WareHouseList: [],
  isWareHouseLoading: false,
  WareHouseError: null,

  fetchWareHouse: async (userdata) => {
    set({ isWareHouseLoading: true, WareHouseError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ WareHouseList: response }); // Update state with fetched data
    } catch (error) {
      set({ WareHouseError: error.message }); // Handle errors
    }
    set({ isWareHouseLoading: false });
  },
  clearWareHouseList: () => {
    set({
      isWareHouseLoading: false,
      WareHouseError: null,
    });
  },
}));

export default useFetchWareHouse;
