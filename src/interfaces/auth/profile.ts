import type { IModalBaseProps } from '../shared/modal';

export interface IEditMePayload {
  email: string;
  fullName: string;
  /** Required by the API when the email changes */
  currentPassword?: string;
};

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
};

export type IProfileModalProps = IModalBaseProps;

export interface IProfileSectionFormProps {
  /** true while the section has unsaved input, so closing the modal can ask first */
  onDirtyChange: (isDirty: boolean) => void;
};
