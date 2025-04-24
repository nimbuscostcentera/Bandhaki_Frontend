import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/data-routes/groupcostcenter-list`;
const useFetchGroupCost = create((set) => ({
  GroupCostList: [],
  isGroupCostLoading: false,
  GroupCostError: null,

  fetchGroupCost: async (userdata) => {
    set({ isGroupCostLoading: true, GroupCostError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ GroupCostList: response }); // Update state with fetched data
    } catch (error) {
      set({ GroupCostError: error.message }); // Handle errors
    }
    set({ isGroupCostLoading: false });
  },
  clearGroupCostList: () => {
    set({
      isGroupCostLoading: false,
      GroupCostError: null,
    });
  },
}));

export default useFetchGroupCost;
