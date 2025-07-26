import { create } from "zustand";
import axiosInstance from "./../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/transaction-routes/openingentry-add`;
const useAddOpenEntry = create((set) => ({
  OpenEntrySuccess: null,
  isOpenEntryLoading: false,
  isOpenEntrySucc: false,
  isOpenEntryError:false,
  OpenEntryError: null,

  InsertOpenEntry: async (userdata) => {
    set({
      isOpenEntryLoading: true,
      OpenEntryError: null,
      OpenEntrySuccess: null,
    }); // Start loading
    try {
      // const endpoint =
      //   userdata?.Cust_Type == 3
      //     ? `${process.env.REACT_APP_BASEURL}/mahajon-routes/mahajonopeningheaders-show`
      //     : `${process.env.REACT_APP_BASEURL}/transaction-routes/openingentry-add`;
      const { data } = await axiosInstance.post(API, userdata);
      const { response } = data;
      //   //console.log(response);
      set({isOpenEntrySucc: true, OpenEntrySuccess: response, isOpenEntryLoading: false }); // Update state with fetched data
    } catch (error) {
      //console.log(error);
      set({
        OpenEntryError: error?.response?.data?.response,
        isOpenEntryLoading: false,
        OpenEntrySuccess: null,
      }); // Handle errors
    } finally {
      set({ isOpenEntryLoading: false });
    }
  },
  ClearStateOpenEntryAdd: () => {
    set({ OpenEntrySuccess: null, isOpenEntryLoading: false, OpenEntryError: null });
  },
}));

export default useAddOpenEntry;
