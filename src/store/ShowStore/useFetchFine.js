import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/fine-show`;
const useFetchFine = create((set) => ({
  FineList: [],
  isFineLoading: false,
  FineError: null,

  fetchFine: async (userdata) => {
    set({ isFineLoading: true, FineError: null }); // Start loading
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ FineList: response }); // Update state with fetched data
    } catch (error) {
      set({ FineError: error.message }); // Handle errors
    }
    set({ isFineLoading: false });
  },
  clearFineList: () => {
    set({
      isFineLoading: false,
      FineError: null,
    });
  },
}));

export default useFetchFine;
