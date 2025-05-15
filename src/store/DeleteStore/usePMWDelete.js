import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/delete-pmw`;
const usePMWDelete = create((set) => ({
  PMWDeleteMsg: "",
  isPMWDeleteLoading: false,
  PMWDeleteErr: null,

  DeletePMW: async (userdata) => {
    set({ isPMWDeleteLoading: true, PMWDeleteErr: null }); // Start loading
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ PMWDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      set({ PMWDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isPMWDeleteLoading: false });
  },
  ClearPMWDelete: () => {
    set({
      isPMWDeleteLoading: false,
      PMWDeleteErr: null,
      PMWDeleteMsg: "",
    });
  },
}));

export default usePMWDelete;
