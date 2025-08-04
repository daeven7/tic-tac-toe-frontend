import api from "../config/axiosConfig";
import { 
  SignInData, 
  SignUpData, 
  AuthResponse, 
  SignUpResponse, 
  RefreshTokenResponse 
} from "../types/auth.type";
import { CONSTANTS, ENDPOINTS, MESSAGES } from "../utils/constants.utils";

export const authService = {
  signUp: async (userInfo: SignUpData): Promise<SignUpResponse> => {
    try {
      const { data } = await api.post<SignUpResponse>(
        ENDPOINTS.SIGN_UP,
        {
          ...userInfo,
        }
      );
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.SIGN_UP_ERROR_MESSAGE
      );
    }
  },

  signIn: async (userData: SignInData): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(
        ENDPOINTS.SIGN_IN,
        {
          ...userData,
        }
      );
      
      localStorage.setItem(CONSTANTS.ACCESS_TOKEN_NAME, data.accessToken);
      localStorage.setItem(CONSTANTS.REFRESH_TOKEN_NAME, data.refreshToken);
      
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.SIGN_IN_ERROR_MESSAGE
      );
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const { data } = await api.post<RefreshTokenResponse>(
        ENDPOINTS.REFRESH_TOKEN,
        {
          refreshToken,
        }
      );
      
      localStorage.setItem(CONSTANTS.ACCESS_TOKEN_NAME, data.accessToken);
      localStorage.setItem(CONSTANTS.REFRESH_TOKEN_NAME, data.refreshToken);
      
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.REFRESH_TOKEN_ERROR_MESSAGE
      );
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem(CONSTANTS.ACCESS_TOKEN_NAME);
      localStorage.removeItem(CONSTANTS.REFRESH_TOKEN_NAME);
      await api.post(ENDPOINTS.LOGOUT, {});
      return;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.LOGOUT_ERROR_MESSAGE
      );
    }
  },
};
