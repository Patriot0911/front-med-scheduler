import type { ILoginRequestPayload } from '@/interfaces/auth/login';
import { IRegisterRequestPayload } from '@/interfaces/auth/register';
import type { IAuthStoreState } from '@/interfaces/auth/store';
import AuthService from '@/lib/services/auth.service';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: IAuthStoreState = {
  user: null,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ILoginRequestPayload) => {
    const res = await AuthService.login(credentials);
    return res.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: IRegisterRequestPayload) => {
    const res = await AuthService.register(credentials);
    console.log('tested');
    return res.data;
  }
);

export const refresh = createAsyncThunk(
  'auth/refresh',
  async () => {
    const res = await AuthService.refreshToken();
    return res.data;
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
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(register.pending, (state) => { console.log('register pending'); })
      .addCase(register.fulfilled, (state, action) => {
        console.log('register fulfilled', action);
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => { console.log('register rejected', action.error); });
  },
});

export const { logout, } = authSlice.actions;
export default authSlice.reducer;
