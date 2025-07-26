import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/WholeSeller-edit`;
const useEditWholeSeller = create((set) => ({
  WSEditSuccess: null,
  isWSEditLoading: false,
  WSEditError: null,

  EditWSFunc: async (userdata) => {
    set({
      isWSEditLoading: true,
      WSEditError: null,
      WSEditSuccess: null,
    }); // Start loading
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axiosInstance.put(API, userdata, config);
      const { response } = data;
      set({
        WSEditSuccess: response,
        isWSEditLoading: false,
        WSEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        WSEditError: error?.response?.data?.response,
        isWSEditLoading: false,
        WSEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditWS: () => {
    set({
      WSEditSuccess: null,
      isWSEditLoading: false,
      WSEditError: null,
    });
  },
}));

export default useEditWholeSeller;
