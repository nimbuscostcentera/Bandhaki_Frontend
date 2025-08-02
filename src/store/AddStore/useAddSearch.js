import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/adddata`;
const useAddSearch = create((set) => ({
  AddSearchSuccess: null,
  isAddSearchLoading: false,
  AddSearchError: null,

  InsertSearch: async (userdata) => {
    //console.log(citydata,"citydata")
    set({
      isAddSearchLoading: true,
      AddSearchError: null,
      AddSearchSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;

      set({ AddSearchSuccess: response, isAddSearchLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddSearchError: error?.response?.data?.response,
        isAddSearchLoading: false,
        AddSearchSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateAddSearch: () => {
    set({
      AddSearchSuccess: null,
      isAddSearchLoading: false,
      AddSearchError: null,
    });
  },
}));

export default useAddSearch;
