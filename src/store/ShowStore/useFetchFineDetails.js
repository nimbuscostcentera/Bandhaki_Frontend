import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/finemasterbyid-show`;
const useFetchFineDetails = create((set) => ({
  FineDetailsList: [],
  isFineDetailsLoading: false,
  FineDetailsError: null,

  fetchFineDetails: async (userdata) => {
    set({ isFineDetailsLoading: true, FineDetailsError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ FineDetailsList: response }); // Update state with fetched data
    } catch (error) {
      set({ FineDetailsError: error.message }); // Handle errors
    }
    set({ isFineDetailsLoading: false });
  },
  clearFineDetailsList: () => {
    set({
      isFineDetailsLoading: false,
      FineDetailsError: null,
    });
  },
}));

export default useFetchFineDetails;
