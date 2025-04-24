import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/verify-metalreturn`;
const useFetchRecheckMetal = create((set) => ({
  RecheckMetalList: [],
  isLoadingRecheckMetal: false,
  errorRecheckMetal: null,
//   pageoptions: {
//     totalOpeningSearchRecords: 0,
//     totalOpeningSearchPages: 0,
//     OpeningSearchCurrentPage: 0,
//   },

  fetchRecheckMetal: async (userdata) => {
    set({ isLoadingRecheckMetal: true, error: null }); // Start isLoadingRecheckMetal
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      console.log(response,"my data");
      set({ RecheckMetalList: response }); // Update state with fetched data
    } catch (error) {
      set({ errorRecheckMetal: error.message }); // Handle errors
    }
    set({ isLoadingRecheckMetal: false });
  },
  ClearRecheckMetal: () => {
    set({ isLoadingRecheckMetal: false, errorRecheckMetal: null });
  },
}));

export default useFetchRecheckMetal;
