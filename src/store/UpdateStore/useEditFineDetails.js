import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/finemasterbyid-edit`;
const useEditFineDetails = create((set) => ({
  FineDetailsEditSuccess: null,
  isFineDetailsEditLoading: false,
  FineDetailsEditError: null,

  EditFineDetailsFunc: async (userdata) => {
    set({
      isFineDetailsEditLoading: true,
      FineDetailsEditError: null,
      FineDetailsEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        FineDetailsEditSuccess: response,
        isFineDetailsEditLoading: false,
        FineDetailsEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        FineDetailsEditError: error?.response?.data?.response,
        isFineDetailsEditLoading: false,
        FineDetailsEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditFineDetails: () => {
    set({
      FineDetailsEditSuccess: null,
      isFineDetailsEditLoading: false,
      FineDetailsEditError: null,
    });
  },
}));

export default useEditFineDetails;
