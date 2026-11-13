import { IModalBaseProps, } from '../shared/modal';

export interface ILogInModalProps extends IModalBaseProps {
  onAuthenticated?: () => void;
};
export interface ILogOutModalProps extends IModalBaseProps {};
