import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transfer-routes/droptable`;
const useInitializedTable = create((set) => ({
  InitializedTableMsg: "",
  isInitializedTableLoading: false,
  InitializedTableErr: null,

  InitializedTableFnc: async (userdata) => {
    set({ isInitializedTableLoading: true, InitializedTableErr: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ InitializedTableMsg: response }); // Update state with fetched data
    } catch (error) {
      set({ InitializedTableErr: error.response.data.response }); // Handle errors
    }
    set({ isInitializedTableLoading: false });
  },
  ClearInitializedTable: () => {
    set({
      isInitializedTableLoading: false,
      InitializedTableErr: null,
      InitializedTableMsg: "",
    });
  },
}));

export default useInitializedTable;
