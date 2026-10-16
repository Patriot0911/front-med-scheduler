import type { IGenericListResponse } from '../shared/generic-response';

export interface IGroupTag {
  id: string;
  name: string;
};

export interface IGroupTagPayload {
  name: string;
};

export type IGroupTagResponse = IGenericListResponse<IGroupTag>;
