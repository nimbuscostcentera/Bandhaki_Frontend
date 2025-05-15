import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/extra-fineadd`;
const useAddFineDetails = create((set) => ({
  FineDetailsAddSuccess: null,
  isFineDetailsAddLoading: false,
  FineDetailsAddError: null,

  FineDetailsAdd: async (userdata) => {
    set({
      isFineDetailsAddLoading: true,
      FineDetailsAddError: null,
      FineDetailsAddSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   console.log(response);
      set({ FineDetailsAddSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        FineDetailsAddError: error?.response?.data?.response,
        FineDetailsAddSuccess: null,
      }); // Handle errors
    } finally {
      set({ isFineDetailsAddLoading: false });
    }
  },
  ClearStateFineDetailsAdd: () => {
    set({
      FineDetailsAddSuccess: null,
      isFineDetailsAddLoading: false,
      FineDetailsAddError: null,
    });
  },
}));

export default useAddFineDetails;
