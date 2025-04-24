import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/costcenter-add`;
const useAddCostCenter = create((set) => ({
  CostCenterSuccess: null,
  isCostCenterLoading: false,
  CostCenterError: null,

  CostCenterAdd: async (userdata) => {
    set({
      isCostCenterLoading: true,
      CostCenterError: null,
      CostCenterSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ CostCenterSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CostCenterError: error?.response?.data?.response,
        CostCenterSuccess: null,
      }); // Handle errors
    } finally {
      set({ isCostCenterLoading: false });
    }
  },
  ClearStateCostCenterAdd: () => {
    set({
      CostCenterSuccess: null,
      isCostCenterLoading: false,
      CostCenterError: null,
    });
  },
}));

export default useAddCostCenter;
