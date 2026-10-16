import type { IGenericListResponse } from '../shared/generic-response';
import type { Permission } from '../auth/permission';

export interface IRole {
  id: string;
  name: string;
  rolePriority: number;
  permissions: Permission[];
};

export interface IRolePayload {
  name: string;
  rolePriority: number;
  permissions: Permission[];
};

export type IRoleResponse = IGenericListResponse<IRole>;
