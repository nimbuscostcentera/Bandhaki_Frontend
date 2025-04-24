import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/item-list`;
const useFetchItem = create((set) => ({
  ItemList: [],
  isItemLoading: false,
  ItemError: null,

  fetchItemMaster: async (userdata) => {
    set({ isItemLoading: true, ItemError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ItemList: response }); // Update state with fetched data
    } catch (error) {
      set({ ItemError: error.message}); // Handle errors
    }
    set({ isItemLoading: false });
  },
  clearItemList: () => {
    set({
      isItemLoading: false,
      ItemError: null,
    });
  },
}));

export default useFetchItem
