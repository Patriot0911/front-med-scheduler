import type { IAuthStoreState } from '@/interfaces/auth/store';
import AuthService, { ACCESS_TOKEN_KEY } from '@/lib/services/auth.service';
import { createSlice, } from '@reduxjs/toolkit';

const initialState: IAuthStoreState = {
  status: 'init',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = 'guest';
      AuthService.clearTokens();
    },
    initAuth: (state) => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      AuthService.setToken(accessToken);
      state.status = accessToken ? 'authenticated' : 'guest';
    }
  },
});

export const { logout, initAuth, } = authSlice.actions;
export default authSlice.reducer;
