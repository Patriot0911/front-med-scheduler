import { IGenericResponse } from '../shared/generic-response';
import { IAuthToken } from './token';
import { IAuthUserPayload } from './user';

interface ILoginResponsePayload {
  tokens: IAuthToken;
  user: IAuthUserPayload;
}

export interface ILoginRequestPayload {
  email: string;
  password: string;
}

export interface ILoginResponse extends IGenericResponse<ILoginResponsePayload> {}
