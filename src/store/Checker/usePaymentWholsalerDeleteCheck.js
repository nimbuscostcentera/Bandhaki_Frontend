import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/check-delete-pmw`;
const usePaymentWholsalerDeleteCheck = create((set) => ({
  CheckPMWDeleteCheckMsg: "",
  isCheckPMWDeleteCheck: -1,
  isCheckPMWDeleteCheckLoading: false,
  CheckPMWDeleteCheckErr: null,

  CheckPMWDeleteCheck: async (userdata) => {
    try {
      set({ isCheckPMWDeleteCheckLoading: true });
      const result = await axiosInstance.post(API, userdata);
      const { success, response } = result.data;

      set({
        isCheckPMWDeleteCheck: success ? 1 : 0,
        CheckPMWDeleteCheckMsg: response,
        CheckPMWDeleteCheckErr: !success ? response : null,
      });
    } catch (error) {
      set({
        isCheckPMWDeleteCheck: 0,
        CheckPMWDeleteCheckErr:
          error.response?.data?.response || "Error checking deletion",
      });
    } finally {
      set({ isCheckPMWDeleteCheckLoading: false });
    }
  },
  ClearCheckPMWDeleteCheck: () => {
    set({
      isCheckPMWDeleteCheckLoading: false,
      CheckPMWDeleteCheckErr: null,
      isCheckPMWDeleteCheck: -1,
    });
  },
}));

export default usePaymentWholsalerDeleteCheck;
