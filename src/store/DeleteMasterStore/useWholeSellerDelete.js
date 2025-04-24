import { create } from "zustand";
import axiosInstance from "../AxiosInterceptor";
const API = `${process.env.REACT_APP_BASEURL}/master-routes/wholeseller-delete`;
const useWholeSellerDelete = create((set) => ({
  WholeSellerDeleteMsg: "",
  isWholeSellerDeleteLoading: false,
  WholeSellerDeleteErr: null,

  DeleteWholeSeller: async (userdata) => {
    set({ isWholeSellerDeleteLoading: true, WholeSellerDeleteErr: null }); // Start loading
    // console.log(userdata,"Payload");
    try {
      const result = await axiosInstance.delete(API, { data: userdata });
      const { data } = result;
      const { response } = data;
      set({ WholeSellerDeleteMsg: response }); // Update state with fetched data
    } catch (error) {
      // console.log(error,"Error messge");
      set({ WholeSellerDeleteErr: error.response.data.response }); // Handle errors
    }
    set({ isWholeSellerDeleteLoading: false });
  },
  ClearWholeSellerDelete: () => {
    set({
      WholeSellerDeleteMsg: "",
      isWholeSellerDeleteLoading: false,
      WholeSellerDeleteErr: null,
    });
  },
}));

export default useWholeSellerDelete;
