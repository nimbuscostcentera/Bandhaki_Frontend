import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/edit-openingdetail`;
const useEditOpeningDetail = create((set) => ({
  OpeningDetailEditSuccess: null,
  isOpeningDetailEditLoading: false,
  OpeningDetailEditError: null,

  EditOpeningDetailFunc: async (userdata) => {
    set({
      isOpeningDetailEditLoading: true,
      OpeningDetailEditError: null,
      OpeningDetailEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        OpeningDetailEditSuccess: response,
        isOpeningDetailEditLoading: false,
        OpeningDetailEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpeningDetailEditError: error?.response?.data?.response,
        isOpeningDetailEditLoading: false,
        OpeningDetailEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditOpeningDetail: () => {
    set({
      OpeningDetailEditSuccess: null,
      isOpeningDetailEditLoading: false,
      OpeningDetailEditError: null,
    });
  },
}));

export default useEditOpeningDetail;
