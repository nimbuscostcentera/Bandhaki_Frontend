import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupcostcenter-delete`;
const useGroupCostCenterDelete = create((set) => ({
  GroupCostCenterDeleteMsg: "",
  isGroupCostCenterDeleteLoading: false,
  GroupCostCenterDeleteErr: null,

  DeleteGroupCostCenter: async (userdata) => {
    set({ isGroupCostCenterDeleteLoading: true, GroupCostCenterDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ GroupCostCenterDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ GroupCostCenterDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isGroupCostCenterDeleteLoading: false });
  },
  ClearGroupCostCenterDelete: () => {
    set({
      GroupCostCenterDeleteMsg: "",
      isGroupCostCenterDeleteLoading: false,
      GroupCostCenterDeleteErr: null,
    });
  },
}));

export default useGroupCostCenterDelete;
