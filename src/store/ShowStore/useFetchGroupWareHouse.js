import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/groupwarehouse-list`;
const useFetchGroupWareHouse = create((set) => ({
  GroupWareHouseList: [],
  isGroupWareHouseFetchLoading: false,
  GroupWareHouseError: null,

  fetchGroupWareHouse: async (userdata) => {
    set({ isGroupWareHouseFetchLoading: true, GroupWareHouseError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ GroupWareHouseList: response }); // Update state with fetched data
    } catch (error) {
      set({ GroupWareHouseError: error.message }); // Handle errors
    }
    set({ isGroupWareHouseFetchLoading: false });
  },
  clearGroupWareHouseList: () => {
    set({
      isGroupWareHouseFetchLoading: false,
      GroupWareHouseError: null,
    });
  },
}));

export default useFetchGroupWareHouse;
