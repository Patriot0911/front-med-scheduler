import { IGenericResponse } from '../shared/generic-response';

export interface IAuthUserPayload {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  roles: string[];
};
export interface IAuthUserResponse extends IGenericResponse<IAuthUserPayload> {};
