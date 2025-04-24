import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/user-show`;
const useFetchUser= create((set) => ({
  UserList: [],
  isUserLoading: false,
  UserError: null,

  fetchUserMaster: async (userdata) => {
    set({ isUserLoading: true, UserError: null }); // Start loading
    try {
        const result = await axiosInstance.post(API, userdata);
        const { data } = result;
        set({ UserList:data?.data, isUserLoading: false }); // Update state with fetched data
    } catch (error) {
      set({ UserError: error.message, isUserLoading: false }); // Handle errors
    }
  },
}));

export default useFetchUser;
