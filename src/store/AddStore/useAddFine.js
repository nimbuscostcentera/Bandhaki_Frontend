import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/fine-add`;
const useAddFine = create((set) => ({
  FineAddSuccess: null,
  isFineAddLoading: false,
  FineAddError: null,

  FineAdd: async (userdata) => {
    set({
      isFineAddLoading: true,
      FineAddError: null,
      FineAddSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   console.log(response);
      set({ FineAddSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        FineAddError: error?.response?.data?.response,
        FineAddSuccess: null,
      }); // Handle errors
    } finally {
      set({ isFineAddLoading: false });
    }
  },
  ClearStateFineAdd: () => {
    set({
      FineAddSuccess: null,
      isFineAddLoading: false,
      FineAddError: null,
    });
  },
}));

export default useAddFine;
