import axios from "axios";

const URL = `${import.meta.env.VITE_BASEURL}`;

// var RefreshToken = localStorage.getItem("RefreshToken");

const AxiosInstance = axios.create({
  baseURL: URL,
  // timeout: 2000,
});

function loadToken() {
  return new Promise((resolve, reject) => {
    const checkToken = () => {
      const token = localStorage.getItem("AccessToken");
      if (token) {
        resolve(token);
      }
      else {
        //Check again after a short delay
        setTimeout(checkToken, 10000); // Delay can be adjusted as needed
        
      }
    };
    checkToken();
  });
}

// Request interceptor
AxiosInstance.interceptors.request.use(
  async function (config) {
    try {
      // Load the token and wait until it is available
      const token = await loadToken();

      // Add the token to the request headers
      config.headers["Authorization"] = `Bearer ${token}`;

      // Return the modified config object to proceed with the request
      return config;
    }
    catch (error) {
        //console.log(error);
      // Handle errors in token loading (e.g., token not available)
      return Promise.reject(new Error("Failed to load token."));
    }
  },
  function (error) {
    // Handle request errors (optional)
    //console.log(error);
    return Promise.reject(error);
  }
);

// Attach response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the response status is 401 (unauthorized) and the request has not been retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Set retry flag

      // Get the refresh token from local storage
      const refreshToken = localStorage.getItem("RefreshToken");

      // Check if refresh token is available
      if (refreshToken) {
        try {
          // Call the token regeneration API
          const AxiosRes = axios.create({
            baseURL: `${import.meta.env.VITE_BASEURL}`,
          });
          AxiosRes.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshToken}`;

          const response = await AxiosRes.post(
            `/auth-routes/token-generate`,
            {}
          );

          // Check for a successful response
          if (response.status === 200) {
            // Get the new access token from the response
            //console.log(response);
            const newAccessToken = response.data?.response?.AccessToken;

            // Store the new access token in local storage
            localStorage.setItem("AccessToken", newAccessToken);

            // Update the original request with the new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return AxiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Handle refresh error (e.g., refresh token expired)
          if (refreshError.response && refreshError.response.status === 402) {
            // Refresh token expired, logout the user
            localStorage.clear();
            window.location.reload();
          } else {
            console.error("Failed to refresh access token:", refreshError);
          }
        }
      } else {
        console.warn("Refresh token not found, cannot refresh access token.");
      }
    }

    // If the request could not be retried or if the error is not 401, reject the promise
    return Promise.reject(error);
  }
);

export default AxiosInstance;
