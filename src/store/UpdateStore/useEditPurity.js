import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/purity-edit`;
const useEditPurity = create((set) => ({
  PurityEditSuccess:null,
  isPurityEditLoading: false,
  PurityEditError: null,

  EditPurityFunc: async (userdata) => {
    //console.log(userdata,"city edit")
    set({
      isPurityEditLoading: true,
      PurityEditError: null,
      PurityEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      set({
        PurityEditSuccess: response,
        isPurityEditLoading: false,
        PurityEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        PurityEditError: error?.response?.data?.response,
        isPurityEditLoading: false,
        PurityEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditPurity: () => {
    set({PurityEditSuccess:null,
  isPurityEditLoading: false,
  PurityEditError: null,})
  }
}));

export default useEditPurity;
