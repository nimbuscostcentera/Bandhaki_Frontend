import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/edit-openingprincipal`;
const useEditOpeningPrincipal = create((set) => ({
  OpePrnEditSuccess: null,
  isOpeningPrnEditSucc:false,
  isOpePrnEditLoading: false,
  OpePrnEditError: null,

  EditOpePrnFunc: async (userdata) => {
    set({isOpePrnEditLoading: true}); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        OpePrnEditSuccess: response,
        isOpeningPrnEditSucc:true
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpePrnEditError: error?.response?.data?.response,
      }); // Handle errors
    }
    set({isOpePrnEditLoading: false});
  },
  ClearStateEditOpePrn: () => {
    set({
      OpePrnEditSuccess: null,
      isOpeningPrnEditSucc: false,
      isOpePrnEditLoading: false,
      OpePrnEditError: null,
    });
  },
}));

export default useEditOpeningPrincipal;
