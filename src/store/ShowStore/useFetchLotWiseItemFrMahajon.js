import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/item-wiselot-mahajan`;
const useFetchLotWiseItemFrMahajon = create((set) => ({
  LotWiseItemFrMahajon: [],
  isLoadingLotWiseItemFrMahajon: false,
  isErrorLotWiseItemFrMahajon: null,
  isSuccesLotWiseItemFrMahajon: false,

  fetchLotWiseItemFrMahajon: async (userdata) => {
    set({ isLoadingLotWiseItemFrMahajon: true, error: null }); // Start isLoadingLotWiseItemFrMahajon
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ LotWiseItemFrMahajon: response, isSuccesLotWiseItemFrMahajon: true }); // Update state with fetched data
    } catch (error) {
      set({ isErrorLotWiseItemFrMahajon: error.message }); // Handle errors
    }
    set({ isLoadingLotWiseItemFrMahajon: false });
  },
  CLearLotWiseItemFrMahajon: () => {
    set({
      isLoadingLotWiseItemFrMahajon: false,
      isErrorLotWiseItemFrMahajon: null,
      isSuccesLotWiseItemFrMahajon: false,
      LotWiseItemFrMahajon: [],
    });
  },
}));

export default useFetchLotWiseItemFrMahajon;
