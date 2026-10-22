import type { IModalBaseProps } from '../shared/modal';

export interface IEditMePayload {
  email: string;
  fullName: string;
};

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
};

export type IProfileModalProps = IModalBaseProps;

export interface IProfileFormProps {
  className?: string;
};
