import type { IModalBaseProps, } from '../shared/modal';
import type { IAuthUser } from './user';

export interface ILogInModalProps extends IModalBaseProps {
  onAuthenticated?: (user: IAuthUser) => void;
  /** `add-account` keeps the current session: it saves the new account and leaves switching to `onAuthenticated` */
  mode?: 'sign-in' | 'add-account';
  defaultEmail?: string;
};
export interface ILogOutModalProps extends IModalBaseProps {};
