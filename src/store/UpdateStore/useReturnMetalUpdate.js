import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/returnmetal`;
const useReturnMetalUpdate = create((set) => ({
  ReturnMetalUpdateSuccess: null,
  isReturnMetalUpdateLoading: false,
  ReturnMetalUpdateError: null,

  ReturnMetalUpdateFunc: async (userdata) => {
    set({
      isReturnMetalUpdateLoading: true,
      ReturnMetalUpdateError: null,
      ReturnMetalUpdateSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        ReturnMetalUpdateSuccess: response,
        isReturnMetalUpdateLoading: false,
        ReturnMetalUpdateError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        ReturnMetalUpdateError: error?.response?.data?.response,
        isReturnMetalUpdateLoading: false,
        ReturnMetalUpdateSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditOpeningHeader: () => {
    set({
      ReturnMetalUpdateSuccess: null,
      isReturnMetalUpdateLoading: false,
      ReturnMetalUpdateError: null,
    });
  },
}));

export default useReturnMetalUpdate;
