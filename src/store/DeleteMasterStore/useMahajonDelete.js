import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/mahajan-delete`;
const useMahajonDelete = create((set) => ({
  MahajonDeleteMsg: "",
  isMahajonDeleteLoading: false,
  MahajonDeleteErr: null,

  DeleteMahajon: async (userdata) => {
    set({ isMahajonDeleteLoading: true, MahajonDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ MahajonDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ MahajonDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isMahajonDeleteLoading: false });
  },
  ClearMahajonDelete: () => {
    set({
      MahajonDeleteMsg: "",
      isMahajonDeleteLoading: false,
      MahajonDeleteErr: null,
    });
  },
}));

export default useMahajonDelete;
