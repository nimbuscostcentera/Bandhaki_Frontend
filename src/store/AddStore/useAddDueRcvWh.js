import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/add-creditamt`;
const useAddDueRcvWh = create((set) => ({
  DueRcvWhAddSuccess: null,
  isDueRcvWhAddLoading: false,
  DueRcvWhAddError: null,

  DueRcvWhAdd: async (userdata) => {
    set({
      isDueRcvWhAddLoading: true,
      DueRcvWhAddError: null,
      DueRcvWhAddSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ DueRcvWhAddSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        DueRcvWhAddError: error?.response?.data?.response,
        DueRcvWhAddSuccess: null,
      }); // Handle errors
    } finally {
      set({ isDueRcvWhAddLoading: false });
    }
  },
  ClearStateDueRcvWhAdd: () => {
    set({
      DueRcvWhAddSuccess: null,
      isDueRcvWhAddLoading: false,
      DueRcvWhAddError: null,
    });
  },
}));

export default useAddDueRcvWh;
