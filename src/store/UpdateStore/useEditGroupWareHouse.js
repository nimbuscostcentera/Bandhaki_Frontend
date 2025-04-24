import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupwarehouse-edit`;
const useEditGroupWareHouse = create((set) => ({
  GroupWareHouseEditSuccess: null,
  isGroupWareHouseEditLoading: false,
  GroupWareHouseEditError: null,

  EditGroupWareHouseFunc: async (userdata) => {
    set({
      isGroupWareHouseEditLoading: true,
      GroupWareHouseEditError: null,
      GroupWareHouseEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      set({
        GroupWareHouseEditSuccess: response,
        isGroupWareHouseEditLoading: false,
        GroupWareHouseEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GroupWareHouseEditError: error?.response?.data?.response,
        isGroupWareHouseEditLoading: false,
        GroupWareHouseEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditGroupWareHouse: () => {
    set({
      GroupWareHouseEditSuccess: null,
      isGroupWareHouseEditLoading: false,
      GroupWareHouseEditError: null,
    });
  },
}));

export default useEditGroupWareHouse;
