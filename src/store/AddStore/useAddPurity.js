import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/Purity-add`;
const useAddPurity = create((set) => ({
  AddPuritySuccess:null,
  isAddPurityLoading: false,
  AddPurityError: null,

  InsertPurity: async (citydata) => {
    //console.log(citydata,"citydata")
    set({
      isAddPurityLoading: true,
      AddPurityError: null,
      AddPuritySuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, citydata);
      const { response } = data;

      set({ AddPuritySuccess: response, isAddPurityLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddPurityError: error?.response?.data?.response,
        isAddPurityLoading: false,
        AddPuritySuccess: null,
      }); // Handle errors
    }
  },
  ClearStateAddPurity: () => {
    set({ AddPuritySuccess:null,
  isAddPurityLoading: false,
  AddPurityError: null,})
  }
}));

export default useAddPurity;
