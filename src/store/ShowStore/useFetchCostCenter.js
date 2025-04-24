import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/costcenter-list`;
const useFetchCostCenter = create((set) => ({
  CostCenterList: [],
  isCostCenterLoading: false,
  CostCenterError: null,
  isCostCenterSuccess:false,
  fetchCostCenter: async (userdata) => {
    set({ isCostCenterLoading: true, CostCenterError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ CostCenterList: response, isCostCenterSuccess :true}); // Update state with fetched data
    } catch (error) {
      set({ CostCenterError: error.message }); // Handle errors
    }
    set({ isCostCenterLoading: false });
  },
  clearCostCenterList: () => {
    set({
      isCostCenterLoading: false,
      CostCenterError: null,
      isCostCenterSuccess:false
    });
  },
}));

export default useFetchCostCenter;
