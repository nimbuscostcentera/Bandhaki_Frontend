import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/wallet-balance`;
const useFetchWallet = create((set) => ({
  WalletBalance: "",
  isWalletLoading: false,
  WalletError: null,

  fetchWallet: async (userdata) => {
    set({ isWalletLoading: true, WalletError: null }); // Start loading
    try {
      const result = await axiosInstance.post(API, userdata);
      const { data } = result;
      const { response } = data;
      set({ WalletBalance: response }); // Update state with fetched data
    } catch (error) {
      set({ WalletError: error.message }); // Handle errors
    }
    set({ isWalletLoading: false });
  },
  clearWalletList: () => {
    set({
      WalletBalance: "",
      isWalletLoading: false,
      WalletError: null,
    });
  },
}));

export default useFetchWallet;
