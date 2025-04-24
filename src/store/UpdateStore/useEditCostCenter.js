import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/costcenter-edit`;
const useEditCostCenter = create((set) => ({
  CostCenterEditSuccess: null,
  isCostCenterEditLoading: false,
  CostCenterEditError: null,

  EditCostCenterFunc: async (userdata) => {
    set({
      isCostCenterEditLoading: true,
      CostCenterEditError: null,
      CostCenterEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.put(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        CostCenterEditSuccess: response,
        isCostCenterEditLoading: false,
        CostCenterEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CostCenterEditError: error?.response?.data?.response,
        isCostCenterEditLoading: false,
        CostCenterEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditCostCenter: () => {
    set({
      CostCenterEditSuccess: null,
      isCostCenterEditLoading: false,
      CostCenterEditError: null,
    });
  },
}));

export default useEditCostCenter;
