import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/del-finedetails`;
const useFineDetailDelete = create((set) => ({
  FineDetailDeleteMsg: "",
  isFineDetailDeleteLoading: false,
  FineDetailDeleteErr: null,

  DeleteFineDetail: async (userdata) => {
    set({ isFineDetailDeleteLoading: true, FineDetailDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ FineDetailDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ FineDetailDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isFineDetailDeleteLoading: false });
  },
  ClearFineDetailDelete: () => {
    set({
      FineDetailDeleteMsg: "",
      isFineDetailDeleteLoading: false,
      FineDetailDeleteErr: null,
    });
  },
}));

export default useFineDetailDelete;
