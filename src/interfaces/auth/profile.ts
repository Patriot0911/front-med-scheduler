import type { ReactNode } from 'react';
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

export type TProfileTab = 'profile' | 'password';

export interface IProfileTabProps {
  onDirtyChange: (isDirty: boolean) => void;
  onCancel: () => void;
  footerStart?: ReactNode;
};
