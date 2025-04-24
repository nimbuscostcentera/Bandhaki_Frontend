import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingentry-add`;
const useAddOpenEntry = create((set) => ({
  OpenEntrySuccess: null,
  isOpenEntryLoading: false,
  OpenEntryError: null,

  InsertOpenEntry: async (userdata) => {
    set({
      isOpenEntryLoading: true,
      OpenEntryError: null,
      OpenEntrySuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   //console.log(response);
      set({ OpenEntrySuccess: response, isOpenEntryLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpenEntryError: error?.response?.data?.response,
        isOpenEntryLoading: false,
        OpenEntrySuccess: null,
      }); // Handle errors
    } finally {
      set({ isOpenEntryLoading: false });
    }
  },
  ClearStateOpenEntryAdd: () => {
    set({ OpenEntrySuccess: null, isOpenEntryLoading: false, OpenEntryError: null });
  },
}));

export default useAddOpenEntry;
