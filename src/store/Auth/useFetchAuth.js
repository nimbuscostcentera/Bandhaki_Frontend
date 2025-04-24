import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
const API = `${process.env.REACT_APP_BASEURL}/master-routes/user-login`;
const useFetchAuth = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      CompanyID: null,
      isAuthLoading: false,
      isAuthError: false,
      AuthError: null,
      isAuthSuccess: false,

      login: async (credentials) => {
        set({ isAuthLoading: true, AuthError: null, isAuthError: false, isAuthSuccess: false });
        try {
          const response = await axios.post(API, credentials); // Replace '/login' with your API endpoint
          const { details } = response.data;
          // console.log(response.data);
          set({
            user: details,
            token: details?.Token,
            CompanyID: details?.CompanyID,
            isAuthLoading: false,
            isAuthSuccess: true,
            isAuthError: false,
          });
        } catch (err) {
          set({
            AuthError: err.response?.data?.response || 'Login failed',
            isAuthLoading: false,
            isAuthError: true,
            isAuthSuccess: false,
          });
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          CompanyID: null,
          isAuthLoading: false,
          isAuthError: false,
          AuthError: null,
          isAuthSuccess: false,
        });
      },
      clearStateAuth: () => {
        set({
          isAuthLoading: false,
          isAuthError: false,
          AuthError: null,
          isAuthSuccess: false,
        });
      }
    }),
    {
      name: 'auth-storage', // Key to store in localStorage
      getStorage: () => localStorage, // Use localStorage (default)
    }
  )
);

export default useFetchAuth;
