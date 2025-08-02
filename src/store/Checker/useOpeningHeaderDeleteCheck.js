import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
let API = `${process.env.REACT_APP_BASEURL}/transaction-routes/delcheck-openingheader`;
const useOpeningHeaderDeleteCheck = create((set) => ({
  CheckOpeningHeaderDeleteCheckMsg: "",
  isCheckOpeningHeaderDeleteCheck: -1,
  isCheckOpeningHeaderDeleteCheckLoading: false,
  CheckOpeningHeaderDeleteCheckErr: null,

  CheckOpeningHeaderDeleteCheck: async (userdata) => {
    try {

      const endpoint =
        userdata?.Cust_Type == 3
          ? `${process.env.REACT_APP_BASEURL}/mahajon-routes/mahajonopeningheaderdeletecheck`
          : `${process.env.REACT_APP_BASEURL}/transaction-routes/delcheck-openingheader`;
      set({ isCheckOpeningHeaderDeleteCheckLoading: true });
      const result = await axiosInstance.post(endpoint, userdata);
      const { success, response } = result.data;

      set({
        isCheckOpeningHeaderDeleteCheck: success ? 1 : 0,
        CheckOpeningHeaderDeleteCheckMsg: response,
        CheckOpeningHeaderDeleteCheckErr: !success ? response : null,
      });
    } catch (error) {
      set({
        isCheckOpeningHeaderDeleteCheck: 0,
        CheckOpeningHeaderDeleteCheckErr:
          error.response?.data?.response || "Error checking deletion",
      });
    } finally {
      set({ isCheckOpeningHeaderDeleteCheckLoading: false });
    }
  },
  ClearCheckOpeningHeaderDeleteCheck: () => {
    set({
      isCheckOpeningHeaderDeleteCheckLoading: false,
      CheckOpeningHeaderDeleteCheckErr: null,
      isCheckOpeningHeaderDeleteCheck: -1,
    });
  },
}));

export default useOpeningHeaderDeleteCheck;
