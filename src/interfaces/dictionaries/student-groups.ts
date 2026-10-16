import type { IGenericListResponse } from '../shared/generic-response';

export interface IStudentGroup {
  id: string;
  name: string;
  studyYear: string;
  /** Group tag ids */
  groupTags: string[];
};

export interface IStudentGroupPayload {
  name: string;
  studyYear: string;
  tagIds: string[];
};

export type IStudentGroupResponse = IGenericListResponse<IStudentGroup>;
