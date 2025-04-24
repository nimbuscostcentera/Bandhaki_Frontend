import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/auth-routes/reset-pass`;
const usePassReset = create((set) => ({
  passResetSuccess: null,
  ispassResetLoading: false,
  passResetError: null,

  passResetFunc: async (userdata) => {
    //console.log(userdata, "resetpass");
    set({
      ispassResetLoading: true,
      passResetError: null,
      passResetSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      //console.log(response)
      set({
        passResetSuccess: response,
        ispassResetLoading: false,
        passResetError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        passResetError: error?.response?.data?.response,
        ispassResetLoading: false,
        passResetSuccess: null,
      }); // Handle errors
    }
  },
  ClearStatepassReset: () => {
    set({
      passResetSuccess: null,
      ispassResetLoading: false,
      passResetError: null,
    });
  },
}));

export default usePassReset;
