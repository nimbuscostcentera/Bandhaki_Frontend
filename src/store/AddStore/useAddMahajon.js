import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/mahajan-add`;
const useAddMahajon = create((set) => ({
  MahajonRegSuccess: null,
  isMahajonRegLoading: false,
  MahajonRegError: null,

  InsertMahajon: async (userdata) => {
    set({ isMahajonRegLoading: true, MahajonRegError: null, MahajonRegSuccess: null }); // Start loading
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axiosInstance.post(API, userdata, config);
      const { response } = data;
      set({ MahajonRegSuccess: response, isMahajonRegLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        MahajonRegError: error?.response?.data?.response,
        isMahajonRegLoading: false,
        MahajonRegSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateInserMahajon: () => {
    set({ MahajonRegSuccess: null, isMahajonRegLoading: false, MahajonRegError: null });
  },
}));

export default useAddMahajon;
