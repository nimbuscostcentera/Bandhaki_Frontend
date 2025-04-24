import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/warehouse-delete`;
const useWarehouseDelete = create((set) => ({
  WarehouseDeleteMsg: "",
  isWarehouseDeleteLoading: false,
  WarehouseDeleteErr: null,

  DeleteWarehouse: async (userdata) => {
    set({ isWarehouseDeleteLoading: true, WarehouseDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ WarehouseDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ WarehouseDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isWarehouseDeleteLoading: false });
  },
  ClearWarehouseDelete: () => {
    set({
      WarehouseDeleteMsg: "",
      isWarehouseDeleteLoading: false,
      WarehouseDeleteErr: null,
    });
  },
}));

export default useWarehouseDelete;
