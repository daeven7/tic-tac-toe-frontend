import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SignInData, SignUpData, User, AuthResponse, SignUpResponse, RefreshTokenResponse } from '../../types/auth.type';
import { CONSTANTS, ENDPOINTS, MESSAGES } from '../../utils/constants.utils';
import api from '../../config/axiosConfig';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const hasAccessToken = localStorage.getItem(CONSTANTS.ACCESS_TOKEN_NAME);
const hasRefreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN_NAME);

const initialState: AuthState = {
  isAuthenticated: !!(hasAccessToken && hasRefreshToken), // Set to true if both tokens exist
  user: null,
  accessToken: hasAccessToken,
  refreshToken: hasRefreshToken,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const response = await api.post<SignUpResponse>(ENDPOINTS.SIGN_UP, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.SIGN_UP_ERROR_MESSAGE
      );
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: SignInData, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(ENDPOINTS.SIGN_IN, data);
      
      localStorage.setItem(CONSTANTS.ACCESS_TOKEN_NAME, response.data.accessToken);
      localStorage.setItem(CONSTANTS.REFRESH_TOKEN_NAME, response.data.refreshToken);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.SIGN_IN_ERROR_MESSAGE
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentRefreshToken = state.auth.refreshToken;
      
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post<RefreshTokenResponse>(ENDPOINTS.REFRESH_TOKEN, {
        refreshToken: currentRefreshToken,
      });
      
      localStorage.setItem(CONSTANTS.ACCESS_TOKEN_NAME, response.data.accessToken);
      localStorage.setItem(CONSTANTS.REFRESH_TOKEN_NAME, response.data.refreshToken);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.REFRESH_TOKEN_ERROR_MESSAGE
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem(CONSTANTS.ACCESS_TOKEN_NAME);
      localStorage.removeItem(CONSTANTS.REFRESH_TOKEN_NAME);
      await api.post(ENDPOINTS.LOGOUT, {});
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || MESSAGES.LOGOUT_ERROR_MESSAGE
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // signin
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // if refresh fails logout user
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer; 