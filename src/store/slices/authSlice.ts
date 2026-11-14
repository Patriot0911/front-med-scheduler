import type { IAuthStoreState } from '@/interfaces/auth/store';
import AuthAccounts from '@/lib/auth-accounts';
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
    },
    initAuth: (state) => {
      state.status = AuthAccounts.init() ? 'authenticated' : 'guest';
    },
    login: (state) => {
      state.status = 'authenticated';
    },
  },
});

export const { logout, initAuth, login, } = authSlice.actions;
export default authSlice.reducer;
