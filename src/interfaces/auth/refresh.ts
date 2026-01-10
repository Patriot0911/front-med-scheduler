import type { IGenericAxiosResponse, } from '../shared/generic-response';
import type { IAuthToken } from './token';
import type { IAuthUserPayload } from './user';

interface IRefreshResponsePayload {
  tokens: IAuthToken;
  user: IAuthUserPayload;
}

export interface IRefreshResponse extends IGenericAxiosResponse<IRefreshResponsePayload> {}
