import axios from 'axios';
import AuthService from './services/auth.service';

let isRefreshing = false;
let queue: (() => void)[] = [];

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    AuthService.setToken(null);

    original._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve) => queue.push(resolve));
      return api(original);
    }

    isRefreshing = true;

    try {
      const { data } = await AuthService.refreshToken();

      AuthService.updateTokens(data.tokens.accessToken, data.tokens.refreshToken);
      queue.forEach((cb) => cb());

      return api(original);
    } catch {
      AuthService.clearTokens();
      window.location.href = '/';
    } finally {
      isRefreshing = false;
    }
  }
);
