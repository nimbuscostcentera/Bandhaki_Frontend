import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/del-openingheader`;
const useOpeningHeaderDelete = create((set) => ({
  OpeningHeaderDeleteMsg: "",
  isOpeningHeaderDeleteLoading: false,
  OpeningHeaderDeleteErr: null,

  DeleteOpeningHeader: async (userdata) => {
    set({ isOpeningHeaderDeleteLoading: true, OpeningHeaderDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.delete(API,{data: userdata});
      const { data } = result;
      const { response } = data;
      set({ OpeningHeaderDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      set({ OpeningHeaderDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isOpeningHeaderDeleteLoading: false });
  },
  ClearOpeningHeaderDelete: () => {
    set({
      isOpeningHeaderDeleteLoading: false,
      OpeningHeaderDeleteErr: null,
      OpeningHeaderDeleteMsg:"",
    });
  },
}));

export default useOpeningHeaderDelete;
