import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/admin-routes/get-credit_admin_setup`;
const useFetchAdminSetUp = create((set) => ({
  AdminSetUp: [],
  isLoadingAdminSetUp: false,
  errorAdminSetUp: null,

  fetchAdminSetUp: async (userdata) => {
    set({ isLoadingAdminSetUp: true, error: null }); // Start isLoadingAdminSetUp
    try {
      const result = await axiosInstance.get(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ AdminSetUp: response }); // Update state with fetched data
    } catch (error) {
      set({ errorAdminSetUp: error.message }); // Handle errors
    }
    set({ isLoadingAdminSetUp: false });
  },
  ClearAdminSetUp: () =>{set({ isLoadingAdminSetUp: false, errorAdminSetUp: null })}
}));

export default useFetchAdminSetUp;
