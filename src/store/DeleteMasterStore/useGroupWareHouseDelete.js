import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupwarehouse-delete`;
const useGroupWareHouseDelete = create((set) => ({
  GroupWareHouseDeleteMsg: "",
  isGroupWareHouseDeleteLoading: false,
  GroupWareHouseDeleteErr: null,

  DeleteGroupWareHouse: async (userdata) => {
    set({
      isGroupWareHouseDeleteLoading: true,
      GroupWareHouseDeleteErr: null,
    }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ GroupWareHouseDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ GroupWareHouseDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isGroupWareHouseDeleteLoading: false });
  },
  ClearGroupWareHouseDelete: () => {
    set({
      GroupWareHouseDeleteMsg: "",
      isGroupWareHouseDeleteLoading: false,
      GroupWareHouseDeleteErr: null,
    });
  },
}));

export default useGroupWareHouseDelete;
