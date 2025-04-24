import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupcostcenter-edit`;
const useEditGroupCost = create((set) => ({
  GroupCostEditSuccess: null,
  isGroupCostEditLoading: false,
  GroupCostEditError: null,

  EditGroupCostFunc: async (userdata) => {
    set({
      isGroupCostEditLoading: true,
      GroupCostEditError: null,
      GroupCostEditSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      // //console.log(response);
      set({
        GroupCostEditSuccess: response,
        isGroupCostEditLoading: false,
        GroupCostEditError: null,
      }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GroupCostEditError: error?.response?.data?.response,
        isGroupCostEditLoading: false,
        GroupCostEditSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateEditGroupCost: () => {
    set({
      GroupCostEditSuccess: null,
      isGroupCostEditLoading: false,
      GroupCostEditError: null,
    });
  },
}));

export default useEditGroupCost;
