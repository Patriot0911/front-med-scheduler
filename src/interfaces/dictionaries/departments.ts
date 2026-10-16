import type { IGenericListResponse } from '../shared/generic-response';

export interface IDepartment {
  id: string;
  name: string;
  headTeacherId: string | null;
};

export interface IDepartmentPayload {
  name: string;
};

export type IDepartmentResponse = IGenericListResponse<IDepartment>;
