import axios from "axios";
import { ENDPOINTS, CONSTANTS } from "../utils/constants.utils";

const api = axios.create({
  baseURL: ENDPOINTS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(CONSTANTS.ACCESS_TOKEN_NAME);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // we don't attempt token refresh for authentication endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register');
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN_NAME);
        
        if (!refreshToken) {
          window.location.href = '/';
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${ENDPOINTS.BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        
        localStorage.setItem(CONSTANTS.ACCESS_TOKEN_NAME, newAccessToken);
        localStorage.setItem(CONSTANTS.REFRESH_TOKEN_NAME, newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        
        localStorage.removeItem(CONSTANTS.ACCESS_TOKEN_NAME);
        localStorage.removeItem(CONSTANTS.REFRESH_TOKEN_NAME);
        window.location.href = '/';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
