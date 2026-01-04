import { IGenericResponse } from '../shared/generic-response';
import { IAuthToken } from './token';
import { IAuthUserPayload } from './user';

interface IRefreshResponsePayload {
  tokens: IAuthToken;
  user: IAuthUserPayload;
}

export interface IRefreshResponse extends IGenericResponse<IRefreshResponsePayload> {}
