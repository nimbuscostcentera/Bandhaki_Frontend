import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/del-openingheader`;
// /del-mahajonopeningheader
const useOpeningHeaderDelete = create((set) => ({
  OpeningHeaderDeleteMsg: "",
  isOpeningHeaderDeleteLoading: false,
  OpeningHeaderDeleteErr: null,

  DeleteOpeningHeader: async (userdata) => {
    set({ isOpeningHeaderDeleteLoading: true, OpeningHeaderDeleteErr: null }); // Start loading
    try {
      const endpoint =
        userdata?.Cust_Type == 3
          ? `${process.env.REACT_APP_BASEURL}/mahajon-routes/del-mahajonopeningheader`
          : `${process.env.REACT_APP_BASEURL}/transaction-routes/del-openingheader`;
      const result = await axiosInstance.delete(endpoint, { data: userdata });
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
