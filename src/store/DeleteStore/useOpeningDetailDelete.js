import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/del-openingdetail`;
const useOpeningDetailDelete = create((set) => ({
  OpeningDetailDeleteMsg:"",
  isOpeningDetailDeleteLoading: false,
  OpeningDetailDeleteErr: null,

  DeleteOpeningDetail: async (userdata) => {
    set({ isOpeningDetailDeleteLoading: true, OpeningDetailDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ OpeningDetailDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      set({ OpeningDetailDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isOpeningDetailDeleteLoading: false });
  },
  ClearOpeningDetailDelete: () => {
    set({
      isOpeningDetailDeleteLoading: false,
      OpeningDetailDeleteErr: null,
      OpeningDetailDeleteMsg:"",
    });
  },
}));

export default useOpeningDetailDelete;
