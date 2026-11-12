import type { IGenericListResponse } from '../shared/generic-response';
import type { Permission } from '../auth/permission';

export interface IRole {
  id: string;
  name: string;
  rolePriority: number;
  permissions: Permission[];
  /** Whether the current user may edit / delete / grant this role (role hierarchy, decided by the API) */
  canManage: boolean;
};

export interface IRolePayload {
  name: string;
  rolePriority: number;
  permissions: Permission[];
};

export type IRoleResponse = IGenericListResponse<IRole>;
