import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  TLoginData,
  TRegisterData
} from '../utils/burger-api';
import { setCookie, getCookie } from '../utils/cookie';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loginRequest: boolean;
  registerRequest: boolean;
  updateRequest: boolean;
  forgotPasswordRequest: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  loginRequest: false,
  registerRequest: false,
  updateRequest: false,
  forgotPasswordRequest: false,
  error: null
};

// Async thunks for auth operations
export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return Promise.reject('No access token');
    }
    const response = await getUserApi();
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData) => {
    console.log(data);
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  setCookie('accessToken', '');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
    return data.email;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check user auth
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null; // Not an error if user is not logged in
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loginRequest = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loginRequest = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.registerRequest = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.registerRequest = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerRequest = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message || 'Logout failed';
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordRequest = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordRequest = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordRequest = false;
        state.error = action.error.message || 'Failed to send reset email';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updateRequest = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateRequest = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateRequest = false;
        state.error = action.error.message || 'Failed to update user';
      });
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => !!state.user,
    getLoginRequest: (state) => state.loginRequest,
    getRegisterRequest: (state) => state.registerRequest,
    getUpdateRequest: (state) => state.updateRequest,
    getForgotPasswordRequest: (state) => state.forgotPasswordRequest,
    getAuthError: (state) => state.error
  }
});

export const { setAuthChecked, clearError } = authSlice.actions;

export const {
  getUser,
  getIsAuthChecked,
  getIsAuthenticated,
  getLoginRequest,
  getRegisterRequest,
  getUpdateRequest,
  getForgotPasswordRequest,
  getAuthError
} = authSlice.selectors;

export default authSlice.reducer;
