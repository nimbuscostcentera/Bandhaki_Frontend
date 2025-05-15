import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/add-paymenttowholesaler`;
const useAddPaymentWholsaler = create((set) => ({
  PaymentWholsalerSuccess: null,
  isPaymentWholsalerLoading: false,
  PaymentWholsalerError: null,

  PaymentWholsalerAdd: async (userdata) => {
    set({
      isPaymentWholsalerLoading: true,
      PaymentWholsalerError: null,
      PaymentWholsalerSuccess: null,
    }); // Start loading
    try {
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      console.log(response);
      set({ PaymentWholsalerSuccess: response }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        PaymentWholsalerError: error?.response?.data?.response,
        PaymentWholsalerSuccess: null,
      }); // Handle errors
    } finally {
      set({ isPaymentWholsalerLoading: false });
    }
  },
  ClearStatePaymentWholsalerAdd: () => {
    set({
      PaymentWholsalerSuccess: null,
      isPaymentWholsalerLoading: false,
      PaymentWholsalerError: null,
    });
  },
}));

export default useAddPaymentWholsaler;
