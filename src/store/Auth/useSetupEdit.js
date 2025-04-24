import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/Setup-add`;
const useSetupEdit = create((set) => ({
  SetupEditSuccess: null,
  isSetupEditLoading: false,
  SetupEditError: null,

  EditSetupFunc: async (userdata) => {
    set({
      isSetupEditLoading: true,
      SetupEditError: null,
      SetupEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axios.post(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        SetupEditSuccess: response,
        isSetupEditLoading: false,
        SetupEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        SetupEditError: error?.response?.data?.response,
        isSetupEditLoading: false,
        SetupEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditSetup: () => {
    set({
      SetupEditSuccess: null,
      isSetupEditLoading: false,
      SetupEditError: null,
    });
  },
}));

export default useSetupEdit;
