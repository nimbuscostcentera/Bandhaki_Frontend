import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/groupcostcenter-add`;
const useAddGroupCost = create((set) => ({
  GroupCostSuccess: null,
  isGroupCostLoading: false,
  GroupCostError: null,

  GroupCostAdd: async (userdata) => {
    set({
      isGroupCostLoading: true,
      GroupCostError: null,
      GroupCostSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ GroupCostSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        GroupCostError: error?.response?.data?.response,
        GroupCostSuccess: null,
      }); // Handle errors
    } finally {
      set({ isGroupCostLoading: false });
    }
  },
  ClearStateGroupCostAdd: () => {
    set({
      GroupCostSuccess: null,
      isGroupCostLoading: false,
      GroupCostError: null,
    });
  },
}));

export default useAddGroupCost;
