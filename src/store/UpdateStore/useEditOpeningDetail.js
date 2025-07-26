import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}`;
const useEditOpeningDetail = create((set) => ({
  OpeningDetailEditSuccess: null,
  isOpeningDetailEditLoading: false,
  isOpeningDetailEditSucc: false,
  isOpeningDetailEditError: false,
  OpeningDetailEditError: null,

  EditOpeningDetailFunc: async (userdata) => {
    set({isOpeningDetailEditLoading: true}); // Start loading
    try {
      let url = `${process.env.REACT_APP_BASEURL}`;
      if (userdata?.Cust_Type == 3) {
        url = url + "/mahajon-routes/mahajonopeningdetailupdate";
      } else {
        url = url + "/transaction-routes/edit-openingdetail";
      }
      const { data } = await axiosInstance.put(url, userdata);
      const { response } = data;
      set({
        OpeningDetailEditSuccess: response,
        isOpeningDetailEditLoading: false,
        isOpeningDetailEditSucc: true,
      }); // Update state with fetched data
    } catch (error) {
      set({
        OpeningDetailEditError: error?.response?.data?.response,
        isOpeningDetailEditLoading: false,
        isOpeningDetailEditError: true,
      }); // Handle errors
    }
    set({isOpeningDetailEditLoading: false});
  },
  ClearStateEditOpeningDetail: () => {
    set({
      OpeningDetailEditSuccess: null,
      isOpeningDetailEditSucc: false,
      isOpeningDetailEditError: false,
      isOpeningDetailEditLoading: false,
      OpeningDetailEditError: null,
    });
  },
}));

export default useEditOpeningDetail;
