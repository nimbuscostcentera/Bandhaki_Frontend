import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/mahajan-edit`;
const useEditMahajon = create((set) => ({
  MahajonEditSuccess: null,
  isMahajonEditLoading: false,
  MahajonEditError: null,

  EditMahajonFunc: async (userdata) => {
    set({
      isMahajonEditLoading: true,
      MahajonEditError: null,
      MahajonEditSuccess: null,
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
        MahajonEditSuccess: response,
        isMahajonEditLoading: false,
        MahajonEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        MahajonEditError: error?.response?.data?.response,
        isMahajonEditLoading: false,
        MahajonEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditMahajon: () => {
    set({
      MahajonEditSuccess: null,
      isMahajonEditLoading: false,
      MahajonEditError: null,
    });
  },
}));

export default useEditMahajon;
