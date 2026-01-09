import type { ILoginRequestPayload, ILoginResponse } from '@/interfaces/auth/login';
import type { IAuthUserResponse } from '@/interfaces/auth/user';
import type { IRefreshResponse } from '@/interfaces/auth/refresh';
import { api } from '../axios';

export const REFRESH_TOKEN_KEY = 'refresh_token';
export const ACCESS_TOKEN_KEY = 'access_token';

export enum AuthQueryKey {
  Me = 'me',
};

class AuthService {
  private static token: string | null = null;

  static setToken(token: string | null) {
    AuthService.token = token;
  }
  static updateTokens(accessToken: string, refreshToken?: string) {
    AuthService.setToken(accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }
  static clearTokens() {
    AuthService.setToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  static getToken(): string | null {
    return AuthService.token;
  }

  static async login(credentials: ILoginRequestPayload): Promise<ILoginResponse> {
    return api.post('/auth/login', credentials);
  }
  static async refreshToken(): Promise<IRefreshResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  }

  static async getMeUser(): Promise<IAuthUserResponse> {
    return api.get('/auth/me');
  }
}

export default AuthService;
