import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/fine-edit`;
const useEditFine = create((set) => ({
  FineEditSuccess: null,
  isFineEditLoading: false,
  FineEditError: null,

  EditFineFunc: async (userdata) => {
    set({
      isFineEditLoading: true,
      FineEditError: null,
      FineEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        FineEditSuccess: response,
        isFineEditLoading: false,
        FineEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        FineEditError: error?.response?.data?.response,
        isFineEditLoading: false,
        FineEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditFine: () => {
    set({
      FineEditSuccess: null,
      isFineEditLoading: false,
      FineEditError: null,
    });
  },
}));

export default useEditFine;
