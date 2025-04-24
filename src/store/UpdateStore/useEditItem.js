import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/item-edit`;
const useEditItem = create((set) => ({
  ItemEditSuccess: null,
  isItemEditLoading: false,
  ItemEditError: null,

  EditItemFunc: async (userdata) => {
    set({
      isItemEditLoading: true,
      ItemEditError: null,
      ItemEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        ItemEditSuccess: response,
        isItemEditLoading: false,
        ItemEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        ItemEditError: error?.response?.data?.response,
        isItemEditLoading: false,
        ItemEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditItem: () => {
    set({
      ItemEditSuccess: null,
      isItemEditLoading: false,
      ItemEditError: null,
    });
  },
}));

export default useEditItem;
