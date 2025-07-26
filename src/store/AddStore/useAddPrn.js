import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/add-principal`;
const useAddPrn = create((set) => ({
  AddPrnSuccess: null,
  isAddPrnLoading: false,
  AddPrnError: null,

  InsertPrn: async (userdata) => {
    //console.log(citydata,"citydata")
    set({
      isAddPrnLoading: true,
      AddPrnError: null,
      AddPrnSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;

      set({ AddPrnSuccess: response, isAddPrnLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddPrnError: error?.response?.data?.response,
        isAddPrnLoading: false,
        AddPrnSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateAddPrn: () => {
    set({
      AddPrnSuccess: null,
      isAddPrnLoading: false,
      AddPrnError: null,
    });
  },
}));

export default useAddPrn;
