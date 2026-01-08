import type { AxiosResponse, } from 'axios';

export interface IGenericResponse<T> extends AxiosResponse<{
  data: T;
  status: boolean;
}> {};
