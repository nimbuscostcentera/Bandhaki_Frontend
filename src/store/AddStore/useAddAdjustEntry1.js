import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/adjustentry-posting`;
const useAddAdjustEntry = create((set) => ({
  AdjustEntrySuccess: "",
  isAdjustEntryLoading: false,
  AdjustEntryError: "",

  AdjustEntryAdd: async (userdata) => {
    set({
      isAdjustEntryLoading: true,
      AdjustEntryError: "",
      AdjustEntrySuccess: "",
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ AdjustEntrySuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AdjustEntryError: error?.response?.data?.response,
        AdjustEntrySuccess: "",
      }); // Handle errors
    } finally {
      set({ isAdjustEntryLoading: false });
    }
  },
  ClearStateAdjustEntryAdd: () => {
    set({
      AdjustEntrySuccess: "",
      isAdjustEntryLoading: false,
      AdjustEntryError: "",
    });
  },
}));

export default useAddAdjustEntry;
