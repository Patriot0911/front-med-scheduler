import { PropsWithChildren } from 'react';

export interface IRequireAuthProps extends PropsWithChildren {
  shouldRedirect?: boolean;
  redirectPath?: string;
  fallback?: React.ReactNode;
};

export interface IRequirePermissionProps extends PropsWithChildren {
  shouldRedirect?: boolean;
  permissions: string[];
  redirectPath?: string;
  fallback?: React.ReactNode;
};
