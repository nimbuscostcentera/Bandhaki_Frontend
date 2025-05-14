import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/admin-routes/update-timing_table`;
const useEditTiming = create((set) => ({
  TimingEditSuccess: null,
  isTimingEditLoading: false,
  TimingEditError: null,

  EditTimingFunc: async (userdata) => {
    set({
      isTimingEditLoading: true,
      TimingEditError: null,
      TimingEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        TimingEditSuccess: response,
        isTimingEditLoading: false,
        TimingEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        TimingEditError: error?.response?.data?.response,
        isTimingEditLoading: false,
        TimingEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditTiming: () => {
    set({
      TimingEditSuccess: null,
      isTimingEditLoading: false,
      TimingEditError: null,
    });
  },
}));

export default useEditTiming;
