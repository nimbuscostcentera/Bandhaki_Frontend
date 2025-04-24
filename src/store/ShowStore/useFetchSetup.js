import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/setup-show`;
const useFetchSetup = create((set) => ({
  SetupList: [],
  isSetupLoading: false,
  SetupError: null,

  fetchSetupMaster: async (userdata) => {
    set({ isSetupLoading: true, SetupError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ SetupList: response, isSetupLoading: false }); // Update Setup with fetched data
    } catch (error) {
      set({ SetupError: error.message, isSetupLoading: false }); // Handle errors
    }
  },
}));

export default useFetchSetup;
