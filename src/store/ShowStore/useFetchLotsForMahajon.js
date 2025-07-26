import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/lotlist-mahajan`;
const useFetchLotsForMahajon = create((set) => ({
  LotsForMahajon: [],
  isLoadingLotsForMahajon: false,
  isErrorLotsForMahajon: null,
  isSuccesLotsForMahajon: false,

  fetchLotsForMahajon: async (userdata) => {
    set({ isLoadingLotsForMahajon: true, error: null }); // Start isLoadingLotsForMahajon
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ LotsForMahajon: response, isSuccesLotsForMahajon: true }); // Update state with fetched data
    } catch (error) {
      set({ isErrorLotsForMahajon: error?.response?.data?.response, LotsForMahajon: [] }); // Handle errors
    }
    set({ isLoadingLotsForMahajon: false });
  },
  CLearLotsForMahajon: () => {
    set({
      isLoadingLotsForMahajon: false,
      isErrorLotsForMahajon: null,
      isSuccesLotsForMahajon: false,
      LotsForMahajon: [],
    });
  },
}));

export default useFetchLotsForMahajon;
