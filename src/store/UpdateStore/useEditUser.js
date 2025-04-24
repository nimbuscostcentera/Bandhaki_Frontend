import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/user-edit`;
const useEditUser = create((set) => ({
  UserEditSuccess: null,
  isUserEditLoading: false,
  UserEditError: null,

  EditUserFunc: async (userdata) => {
    //console.log(userdata, "city edit");
    set({
      isUserEditLoading: true,
      UserEditError: null,
      UserEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      set({
        UserEditSuccess: response,
        isUserEditLoading: false,
        UserEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        UserEditError: error?.response?.data?.response,
        isUserEditLoading: false,
        UserEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditUser: () => {
    set({
      UserEditSuccess: null,
      isUserEditLoading: false,
      UserEditError: null,
    });
  },
}));

export default useEditUser;
