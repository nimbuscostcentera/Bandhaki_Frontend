import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/costcenter-delete`;
const useCostCenterDelete = create((set) => ({
  CostCenterDeleteMsg: "",
  isCostCenterDeleteSuccess:false,
  isCostCenterDeleteLoading: false,
  CostCenterDeleteErr: null,

  DeleteCostCenter: async (userdata) => {
    set({ isCostCenterDeleteLoading: true, CostCenterDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ CostCenterDeleteMsg: response, isCostCenterDeleteSuccess:true }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ CostCenterDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isCostCenterDeleteLoading: false });
  },
  ClearCostCenterDelete: () => {
    set({
      CostCenterDeleteMsg: "",
      isCostCenterDeleteLoading: false,
      CostCenterDeleteErr: null,
      isCostCenterDeleteSuccess:false,
    });
  },
}));

export default useCostCenterDelete;
