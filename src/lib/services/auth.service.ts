import type { ILoginRequestPayload, ILoginResponse } from '@/interfaces/auth/login';
import type { IRefreshResponse } from '@/interfaces/auth/refresh';
import { IAuthMeResponse } from '@/interfaces/auth/me';
import type { IChangePasswordPayload, IEditMePayload } from '@/interfaces/auth/profile';
import type { IGenericResponse } from '@/interfaces/shared/generic-response';
import { apiConfig, apiClient, } from '../axios';
import axios from 'axios';

export enum AuthQueryKey {
  Me = 'me',
};

const withRefreshToken = (refreshToken: string) => ({
  ...apiConfig,
  headers: {
    Authorization: `Bearer ${refreshToken}`,
  },
});

// both go around apiClient: a rejected refresh token must not trigger another refresh
class AuthService {
  static async logout(refreshToken: string): Promise<boolean> {
    const { data, } = await axios.post<IGenericResponse<boolean>>('/auth/logout', {}, withRefreshToken(refreshToken));
    return data.data;
  }

  static async refreshToken(refreshToken: string): Promise<IRefreshResponse> {
    const { data, } = await axios.post<IGenericResponse<IRefreshResponse>>('/auth/refresh', {}, withRefreshToken(refreshToken));
    return data.data;
  }

  static async login(credentials: ILoginRequestPayload): Promise<ILoginResponse> {
    return apiClient.post('/auth/login', credentials);
  }

  static async getMeUser(): Promise<IAuthMeResponse> {
    return apiClient.get('/auth/me');
  }

  static async editMe(payload: IEditMePayload): Promise<IAuthMeResponse> {
    return apiClient.put('/auth/me', payload);
  }

  static async changePassword(payload: IChangePasswordPayload): Promise<boolean> {
    return apiClient.put('/auth/me/password', payload);
  }
}

export default AuthService;
