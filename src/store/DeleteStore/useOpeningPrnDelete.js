import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/del-openingprincipal`;
const useOpeningPrnDelete = create((set) => ({
  isOpnPrnDeleteSucc:false,
  OpeningPrnDeleteMsg: "",
  isOpeningPrnDeleteLoading: false,
  OpeningPrnDeleteErr: null,
  

  DeleteOpeningPrn: async (userdata) => {
    set({ isOpeningPrnDeleteLoading: true, OpeningPrnDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      console.log(result, "result");
      const { data } = result;
      const { response } = data;
      set({ OpeningPrnDeleteMsg: response, isOpnPrnDeleteSucc:true }); // Update state with fetched data
    } catch (error) {
      console.log(error, "Error messge");
      set({ OpeningPrnDeleteErr: error?.response?.data?.response }); // Handle errors
    }
    set({ isOpeningPrnDeleteLoading: false });
  },
  ClearOpeningPrnDelete: () => {
    set({
      isOpeningPrnDeleteLoading: false,
      OpeningPrnDeleteErr: null,
      isOpnPrnDeleteSucc: false,
      OpeningPrnDeleteMsg:null,
    });
  },
}));

export default useOpeningPrnDelete;
