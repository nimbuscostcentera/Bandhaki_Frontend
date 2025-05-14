import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/add-extraitem`;
const useAddExtraItem = create((set) => ({
  ExtraItemAddSuccess: null,
  isExtraItemAddLoading: false,
  ExtraItemAddError: null,

  ExtraItemAdd: async (userdata) => {
    set({
      isExtraItemAddLoading: true,
      ExtraItemAddError: null,
      ExtraItemAddSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ ExtraItemAddSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        ExtraItemAddError: error?.response?.data?.response,
        ExtraItemAddSuccess: null,
      }); // Handle errors
    } finally {
      set({ isExtraItemAddLoading: false });
    }
  },
  ClearStateExtraItemAdd: () => {
    set({
      ExtraItemAddSuccess: null,
      isExtraItemAddLoading: false,
      ExtraItemAddError: null,
    });
  },
}));

export default useAddExtraItem;
