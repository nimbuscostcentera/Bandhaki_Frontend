import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/checkedit-openingdetail`;
const useCheckOpeningDetails = create((set) => ({
  CheckOpeningDetailsMsg: "",
  isCheckOpDetail:0,
  isCheckOpeningDetailsLoading: false,
  CheckOpeningDetailsErr: null,

  CheckOpeningDetails: async (userdata) => {
    set({ isCheckOpeningDetailsLoading: true, CheckOpeningDetailsErr: null }); // Start loading
    try {
      const endpoint =
        userdata?.Cust_Type == 3
          ? `${process.env.REACT_APP_BASEURL}/mahajon-routes/mahajonopeningdetailedit-check`
          : `${process.env.REACT_APP_BASEURL}/transaction-routes/checkedit-openingdetail`;
      const result = await axiosInstance.post(endpoint, userdata);
      const { data } = result;
      console.log(data, "my");
      const { response, success } = data;
      set({
        CheckOpeningDetailsMsg: response,
        isCheckOpDetail: success?1:0,
      }); // Update state with fetched data
    } catch (error) {
       console.log(error?.response?.data?.response, "my");
      set({ CheckOpeningDetailsErr: error?.response?.data?.response ,isCheckOpDetail:2}); // Handle errors
    }
    set({ isCheckOpeningDetailsLoading: false });
  },
  ClearCheckOpeningDetails: () => {
    set({
      isCheckOpeningDetailsLoading: false,
      CheckOpeningDetailsErr: null,
      isCheckOpDetail:0,
    });
  },
}));

export default useCheckOpeningDetails;
