import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/customer-add`;
const useRegCustomer = create((set) => ({
  CustRegSuccess:null,
  isCustRegLoading: false,
  CustRegError: null,

  InsertCust: async (userdata) => {
    set({ isCustRegLoading: true, CustRegError: null, CustRegSuccess:null}); // Start loading
    try {
     const config = {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     };
    const { data } = await axiosInstance.post(API, userdata, config);
    const { response } = data;
    set({ CustRegSuccess:response, isCustRegLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        CustRegError: error?.response?.data?.response,
        isCustRegLoading: false,
        CustRegSuccess: null,
      }); // Handle errors
    }
  },
  ClearStateInserCust: () => {
    set({CustRegSuccess:null,
  isCustRegLoading: false,
  CustRegError: null})
  }
  
}));

export default useRegCustomer;
