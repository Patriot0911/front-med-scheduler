import type { ILoginRequestPayload } from '@/interfaces/auth/login';
import type { IAuthStoreState } from '@/interfaces/auth/store';
import AuthService, { ACCESS_TOKEN_KEY } from '@/lib/services/auth.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: IAuthStoreState = {
  user: null,
  status: 'processing',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginRequestPayload) => {
    const { data, } = await AuthService.login(credentials);
    return data;
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async () => {
    const { data, } = await AuthService.refreshToken();
    return data;
  }
);

export const initAuth = createAsyncThunk(
  'auth/init',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      throw rejectWithValue('No token');
    }

    AuthService.setToken(token);
    try {
      const { data, } = await AuthService.getMeUser();
      return data;
    } catch (e: any) {
      throw rejectWithValue(e.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      AuthService.clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'processing';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'authenticated';
        AuthService.updateTokens(
          action.payload.tokens.accessToken, action.payload.tokens.refreshToken
        );
      })
      .addCase(login.rejected, (state) => {
        state.status = 'guest';
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.user = action.payload.user;
        AuthService.updateTokens(
          action.payload.tokens.accessToken, action.payload.tokens.refreshToken
        );
      })
      .addCase(refresh.rejected, (state) => {
        state.status = 'guest';
      })
      .addCase(initAuth.pending, (state) => {
        state.status = 'processing';
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(initAuth.rejected, (state) => {
        state.status = 'guest';
      })
  },
});

export const { logout, } = authSlice.actions;
export default authSlice.reducer;
