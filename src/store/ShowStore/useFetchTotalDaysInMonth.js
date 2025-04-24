import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/days-in-bangla-month`;
const useFetchDaysInMonth = create((set) => ({
  DaysInMonthList: [],
  isDaysInMonthLoading: false,
  DaysInMonthError: null,

  fetchDaysInMonth: async (userdata) => {
    set({ isDaysInMonthLoading: true, DaysInMonthError: null }); // Start loading
    try {
      const result = await axiosInstance.get(`${API}/${userdata}`);
      const { data } = result;
      const { response } = data;
      set({
        DaysInMonthList: response,
      }); // Update state with fetched data
    } catch (error) {
      set({ DaysInMonthError: error.message }); // Handle errors
    }
    set({ isDaysInMonthLoading: false });
  },
  clearDaysInMonthList: () => {
    set({
      isDaysInMonthLoading: false,
      DaysInMonthError: null,
    });
  },
}));

export default useFetchDaysInMonth;
