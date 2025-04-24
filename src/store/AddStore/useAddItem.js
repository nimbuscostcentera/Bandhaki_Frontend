import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/item-add`;
const useAddItem = create((set) => ({
  ItemRegSuccess: null,
  isItemRegLoading: false,
  ItemRegError: null,

  InsertItem: async (userdata) => {
    set({
      isItemRegLoading: true,
      ItemRegError: null,
      ItemRegSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   //console.log(response);
      set({ ItemRegSuccess: response, isItemRegLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        ItemRegError: error?.response?.data?.response,
        isItemRegLoading: false,
        ItemRegSuccess: null,
      }); // Handle errors
    } finally {
      set({ isItemRegLoading: false });
    }
  },
  ClearStateItemAdd: () => {
    set({ ItemRegSuccess: null, isItemRegLoading: false, ItemRegError: null });
  },
}));

export default useAddItem;
