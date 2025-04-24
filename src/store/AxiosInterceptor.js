import axios from "axios";

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token to Every Request
axiosInstance.interceptors.request.use(
  (config) => {
    const getToken = JSON.parse(localStorage.getItem("auth-storage"));
    const token = getToken?.state?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Token (403)
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response?.status === 403) {
      console.error("Invalid or expired token. Clearing session...");
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
