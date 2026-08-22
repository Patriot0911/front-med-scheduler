import { LoadingState } from '@/lib/loading-mappers';
import { PropsWithChildren } from 'react';

export interface IModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
};
export interface IModalProps extends IModalBaseProps, PropsWithChildren {
  isLoading?: boolean;
  className?: string;
};

export interface IConfirmModalProps extends IModalBaseProps, PropsWithChildren {
  onConfirm: () => void;
  onCancel?: () => void;
  requestState?: LoadingState;
  confirmationWord?: string;
};
