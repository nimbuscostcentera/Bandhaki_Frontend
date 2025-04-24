import { create } from "zustand";
import axios from "axios";
// import axiosInstance from "./AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/report-routes/regular-orderbywtartisanlist`;
const useFetchItemArtisian = create((set) => ({
  ItemArtisianList: [],
  isItemArtisianLoading: false,
  ItemArtisianError: null,

  fetchItemArtisianMaster: async (userdata) => {
    set({ isItemArtisianLoading: true, ItemArtisianError: null }); // Start loading
    try {
      const result = await axios.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ ItemArtisianList: response, isItemArtisianLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ ItemArtisianError: error.message, isItemArtisianLoading: false }); // Handle errors
    }
  },
}));

export default useFetchItemArtisian;
