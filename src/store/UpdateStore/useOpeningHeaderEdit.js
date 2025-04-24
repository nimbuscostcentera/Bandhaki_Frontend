import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/edit-openingheader`;
const useOpeningHeaderEdit = create((set) => ({
  OpeningHeaderEditSuccess: null,
  isOpeningHeaderEditLoading: false,
  OpeningHeaderEditError: null,

  EditOpeningHeaderFunc: async (userdata) => {
    set({
      isOpeningHeaderEditLoading: true,
      OpeningHeaderEditError: null,
      OpeningHeaderEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        OpeningHeaderEditSuccess: response,
        isOpeningHeaderEditLoading: false,
        OpeningHeaderEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpeningHeaderEditError: error?.response?.data?.response,
        isOpeningHeaderEditLoading: false,
        OpeningHeaderEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditOpeningHeader: () => {
    set({
      OpeningHeaderEditSuccess: null,
      isOpeningHeaderEditLoading: false,
      OpeningHeaderEditError: null,
    });
  },
}));

export default useOpeningHeaderEdit;
