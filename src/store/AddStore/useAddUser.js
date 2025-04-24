import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/user-reg`;
const useAddUser = create((set) => ({
  AddUserSuccess:null,
  isAddUserLoading: false,
  AddUserError: null,

  InsertUser: async (Userdata) => {
    set({ isAddUserLoading: true, AddUserError: null, AddUserSuccess:null}); // Start loading
    try {
        const { data } = await axiosInstance.post(API, Userdata);
        const { response } = data;
        set({ AddUserSuccess:response, isAddUserLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        AddUserError: error?.response?.data?.response,
        isAddUserLoading: false,
        AddUserSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateUserAdd: () => {
  set({AddUserSuccess:null,
  isAddUserLoading: false,
  AddUserError: null})
  }
}));

export default useAddUser;
