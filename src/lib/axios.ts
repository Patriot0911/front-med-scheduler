import { getGlobalI18n } from '@/i18n/client/i18nRef';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AuthService from './services/auth.service';
import AuthAccounts from './auth-accounts';
import { queryClient } from './query-client';
import { getGlobalStore } from '../store/storeRef';
import { logout } from '@/store/slices/authSlice';

class SessionEndedError extends Error {}

let refreshing: Promise<void> | null = null;

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
};
export const apiClient = axios.create(apiConfig);

/*
 * Each refresh rotates the token, so tabs of one account refresh under a shared lock;
 * the one that waited reuses the tokens another tab has already stored instead of spending the old one.
 */
const refreshActiveSession = async () => {
  const account = AuthAccounts.getActive();
  if (!account?.refreshToken) throw new SessionEndedError();
  const usedToken = account.refreshToken;

  const run = async () => {
    AuthAccounts.sync();
    const current = AuthAccounts.getAccount(account.id);
    if (current?.status !== 'signed_in' || !current.refreshToken) throw new SessionEndedError();
    if (current.refreshToken !== usedToken) return;

    const { tokens, user, } = await AuthService.refreshToken(usedToken);
    AuthAccounts.updateSession(account.id, tokens, user);
  };

  if ('locks' in navigator) {
    await navigator.locks.request(`auth-refresh:${account.id}`, run);
  } else {
    await run();
  }
};

// one refresh at a time per tab, the parallel 401s wait for it
const refreshSession = () => {
  refreshing ??= refreshActiveSession().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

// a network error or 5xx leaves the session alone, only a rejected token ends it
const isSessionRejected = (error: unknown) => (
  error instanceof SessionEndedError
  || (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0))
);

apiClient.interceptors.request.use((config) => {
  const token = AuthAccounts.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const accountId = AuthAccounts.getActive()?.id;

    if (error.response?.status !== 401 || original._retry || !accountId) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      await refreshSession();
    } catch (err) {
      if (isSessionRejected(err) && AuthAccounts.getActive()?.id === accountId) {
        AuthAccounts.signOut(accountId);
        getGlobalStore()?.dispatch(logout());
        queryClient.clear();
      }
      return Promise.reject(err instanceof SessionEndedError ? error : err);
    }

    if (AuthAccounts.getActive()?.id !== accountId) {
      return Promise.reject(error);
    }
    return apiClient(original);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response?.status !== 'number' || !response?.headers) {
      return response;
    }
    return response.data?.data ?? response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    if (error.request) {
      return Promise.reject({
        status: false,
        message: getGlobalI18n().t('errors.noResponse'),
      });
    }

    return Promise.reject({
      status: false,
      message: error.message ?? getGlobalI18n().t('errors.unexpected'),
    });
  },
);
