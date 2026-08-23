import { LoadingState } from '@/lib/loading-mappers';
import { FormHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface IModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
};

export interface IModalHeaderProps {
  title: string;
  description?: string;
};

export interface IModalFormBodyProps extends
PropsWithChildren,
FormHTMLAttributes<HTMLFormElement> {
  methods: UseFormReturn<any>;
};

export interface IModalContentProps extends
  PropsWithChildren,
  HTMLAttributes<HTMLDivElement> {};

export interface IModalFooterProps extends PropsWithChildren {
};

export interface IModalProps extends IModalBaseProps, PropsWithChildren {
  isLoading?: boolean;
  className?: string;
};

export interface IConfirmModalProps extends IModalBaseProps, PropsWithChildren {
  onConfirm: () => void;
  onCancel?: () => void;
  requestState?: LoadingState;
  disabled?: boolean;
  confirmationWord?: string;
  description?: string;
};
