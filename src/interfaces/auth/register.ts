import { IGenericResponse } from '../shared/generic-response';
import { IAuthToken } from './token';
import { IAuthUserPayload } from './user';

interface IRegisterResponsePayload {
  tokens: IAuthToken;
  user: IAuthUserPayload;
}

export interface IRegisterRequestPayload {
  email: string;
  fullName: string;
  password: string;
}
export interface IRegisterResponse extends IGenericResponse<IRegisterResponsePayload> {}
