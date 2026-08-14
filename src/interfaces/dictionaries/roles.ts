import type { IGenericListResponse } from '../shared/generic-response';

export interface IRole {
  id: string;
  name: string;
  permissions: string[]; // todo: to enum?
};

export interface IRoleResponse extends IGenericListResponse<IRole> {};
