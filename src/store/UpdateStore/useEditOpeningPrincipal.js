import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/edit-openingprincipal`;
const useEditOpeningPrincipal = create((set) => ({
  OpePrnEditSuccess: null,
  isOpePrnEditLoading: false,
  OpePrnEditError: null,

  EditOpePrnFunc: async (userdata) => {
    set({
      isOpePrnEditLoading: true,
      OpePrnEditError: null,
      OpePrnEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        OpePrnEditSuccess: response,
        isOpePrnEditLoading: false,
        OpePrnEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpePrnEditError: error?.response?.data?.response,
        isOpePrnEditLoading: false,
        OpePrnEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditOpePrn: () => {
    set({
      OpePrnEditSuccess: null,
      isOpePrnEditLoading: false,
      OpePrnEditError: null,
    });
  },
}));

export default useEditOpeningPrincipal;
