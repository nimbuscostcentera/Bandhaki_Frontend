import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/warehouse-edit`;
const useEditWareHouse = create((set) => ({
  WareHouseEditSuccess: null,
  isWareHouseEditLoading: false,
  WareHouseEditError: null,

  EditWareHouseFunc: async (userdata) => {
    set({
      isWareHouseEditLoading: true,
      WareHouseEditError: null,
      WareHouseEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        WareHouseEditSuccess: response,
        isWareHouseEditLoading: false,
        WareHouseEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        WareHouseEditError: error?.response?.data?.response,
        isWareHouseEditLoading: false,
        WareHouseEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditWareHouse: () => {
    set({
      WareHouseEditSuccess: null,
      isWareHouseEditLoading: false,
      WareHouseEditError: null,
    });
  },
}));

export default useEditWareHouse;
