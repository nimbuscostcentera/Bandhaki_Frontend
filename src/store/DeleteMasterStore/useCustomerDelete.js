import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/customer-delete`;
const useCustomerDelete = create((set) => ({
  CustomerDeleteMsg: "",
  isCustomerDeleteLoading: false,
  CustomerDeleteErr: null,

  DeleteCustomer: async (userdata) => {
    set({ isCustomerDeleteLoading: true, CustomerDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data:userdata});
      const { data } = result;
      const { response } = data;
      set({ CustomerDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ CustomerDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isCustomerDeleteLoading: false });
  },
  ClearCustomerDelete: () => {
    set({
      CustomerDeleteMsg: "",
      isCustomerDeleteLoading: false,
      CustomerDeleteErr: null,
    });
  },
}));

export default useCustomerDelete;
