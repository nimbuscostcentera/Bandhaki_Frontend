import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/fineheader-show`;
const useFetchFineHeader = create((set) => ({
  FineHeaderList: [],
  isFineHeaderLoading: false,
  FineHeaderError: null,

  fetchFineHeader: async (userdata) => {
    set({ isFineHeaderLoading: true, FineHeaderError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ FineHeaderList: response }); // Update state with fetched data
    } catch (error) {
      set({ FineHeaderError: error.message }); // Handle errors
    }
    set({ isFineHeaderLoading: false });
  },
  clearFineHeaderList: () => {
    set({
      isFineHeaderLoading: false,
      FineHeaderError: null,
    });
  },
}));

export default useFetchFineHeader;
