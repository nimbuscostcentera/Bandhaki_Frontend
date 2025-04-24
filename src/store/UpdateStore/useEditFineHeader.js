import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/fineheader-edit`;
const useEditFineHeader = create((set) => ({
  FineHeaderEditSuccess: null,
  isFineHeaderEditLoading: false,
  FineHeaderEditError: null,

  EditFineHeaderFunc: async (userdata) => {
    set({
      isFineHeaderEditLoading: true,
      FineHeaderEditError: null,
      FineHeaderEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        FineHeaderEditSuccess: response,
        isFineHeaderEditLoading: false,
        FineHeaderEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        FineHeaderEditError: error?.response?.data?.response,
        isFineHeaderEditLoading: false,
        FineHeaderEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditFineHeader: () => {
    set({
      FineHeaderEditSuccess: null,
      isFineHeaderEditLoading: false,
      FineHeaderEditError: null,
    });
  },
}));

export default useEditFineHeader;
