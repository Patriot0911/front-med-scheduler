import type { IGenericListResponse } from '../shared/generic-response';

export interface ISemester {
  id: string;
  name: string;
  dateFrom: string;
  dateTo: string;
};

export interface ISemesterPayload {
  name: string;
  dateFrom: string;
  dateTo: string;
};

export type ISemesterResponse = IGenericListResponse<ISemester>;
