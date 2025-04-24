import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/warehouse-add`;
const useAddWareHouse = create((set) => ({
  WareHouseSuccess: null,
  isWareHouseLoading: false,
  WareHouseError: null,

  WareHouseAdd: async (userdata) => {
    set({
      isWareHouseLoading: true,
      WareHouseError: null,
      WareHouseSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ WareHouseSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        WareHouseError: error?.response?.data?.response,
        WareHouseSuccess: null,
      }); // Handle errors
    } finally {
      set({ isWareHouseLoading: false });
    }
  },
  ClearStateWareHouseAdd: () => {
    set({
      WareHouseSuccess: null,
      isWareHouseLoading: false,
      WareHouseError: null,
    });
  },
}));

export default useAddWareHouse;
