import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/fineheader-delete`;
const useFineHeaderDelete = create((set) => ({
  FineHeaderDeleteMsg: "",
  isFineHeaderDeleteLoading: false,
  FineHeaderDeleteErr: null,

  DeleteFineHeader: async (userdata) => {
    set({ isFineHeaderDeleteLoading: true, FineHeaderDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ FineHeaderDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ FineHeaderDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isFineHeaderDeleteLoading: false });
  },
  ClearFineHeaderDelete: () => {
    set({
      FineHeaderDeleteMsg: "",
      isFineHeaderDeleteLoading: false,
      FineHeaderDeleteErr: null,
    });
  },
}));

export default useFineHeaderDelete;
