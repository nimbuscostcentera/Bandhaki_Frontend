import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/del-adjustvoucher`;
const useAdjustVouDelete = create((set) => ({
  AdjustVouDeleteMsg: "",
  isAdjustVouDeleteLoading: false,
  AdjustVouDeleteErr: null,

  DeleteAdjustVou: async (userdata) => {
    set({ isAdjustVouDeleteLoading: true, AdjustVouDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data:userdata});
      const { data } = result;
      const { response } = data;
      set({ AdjustVouDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ AdjustVouDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isAdjustVouDeleteLoading: false });
  },
  ClearAdjustVouDelete: () => {
    set({
      AdjustVouDeleteMsg: "",
      isAdjustVouDeleteLoading: false,
      AdjustVouDeleteErr: null,
    });
  },
}));

export default useAdjustVouDelete;
