import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/WholeSeller-add`;
const useRegWholeSeller = create((set) => ({
  WSRegSuccess: null,
  isWSRegLoading: false,
  WSRegError: null,

  InsertWS: async (userdata) => {
    set({ isWSRegLoading: true, WSRegError: null, WSRegSuccess: null }); // Start loading
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axiosInstance.post(API, userdata, config);
      const { response } = data;
      set({ WSRegSuccess: response, isWSRegLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        WSRegError: error?.response?.data?.response,
        isWSRegLoading: false,
        WSRegSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateInserWS: () => {
    set({ WSRegSuccess: null, isWSRegLoading: false, WSRegError: null });
  },
}));

export default useRegWholeSeller;
