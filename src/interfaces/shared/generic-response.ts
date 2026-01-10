import { AxiosResponse } from 'axios';

export interface IGenericResponse<T> {
  data: T;
  status: boolean;
};
export interface IGenericAxiosResponse<T> extends AxiosResponse<IGenericResponse<T>> {};
export interface IBooleanResponse extends IGenericResponse<boolean> {};
