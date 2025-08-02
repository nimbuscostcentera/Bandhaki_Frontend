import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/mahajon-routes/mahajonopeningheaders-add`;
const useAddFundFrmMahajon = create((set) => ({
  isAddFundFrmMahajonSuccess: false,
  AddFundFrmMahajonSuccessMsg:null,
  isAddFundFrmMahajonLoading: false,
  isAddFundFrmMahajonError: false,
  AddFundFrmMahajonErrorMsg: null,

  AddFundFrmMahajon: async (userdata) => {
    set({isAddFundFrmMahajonLoading: true}); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   console.log(response);
      set({ AddFundFrmMahajonSuccess: response ,isAddFundFrmMahajonSuccess:true}); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        isAddFundFrmMahajonError: true,
        AddFundFrmMahajonError: error?.response?.data?.response,
      }); // Handle errors
    } finally {
      set({ isAddFundFrmMahajonLoading: false });
    }
  },
  ClearStateAddFundFrmMahajon: () => {
    set({
      AddFundFrmMahajonSuccess: null,
      isAddFundFrmMahajonLoading: false,
      AddFundFrmMahajonError: null,
      isAddFundFrmMahajonError: false,
      isAddFundFrmMahajonSuccess: false,
    });
  },
}));

export default useAddFundFrmMahajon;
