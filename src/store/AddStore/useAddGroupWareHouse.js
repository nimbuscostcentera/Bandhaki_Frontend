import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupwarehouse-add`;
const useAddGroupWareHouse = create((set) => ({
  GroupWareHouseSuccess: null,
  isGroupWareHouseLoading: false,
  GroupWareHouseError: null,

  addGroupWareHouse: async (userdata) => {
    set({
      isGroupWareHouseLoading: true,
      GroupWareHouseError: null,
      GroupWareHouseSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ GroupWareHouseSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GroupWareHouseError: error?.response?.data?.response,
        GroupWareHouseSuccess: null,
      }); // Handle errors
    } finally {
      set({ isGroupWareHouseLoading: false });
    }
  },
  ClearStateGroupWareHouseAdd: () => {
    set({
      GroupWareHouseSuccess: null,
      isGroupWareHouseLoading: false,
      GroupWareHouseError: null,
    });
  },
}));

export default useAddGroupWareHouse;
