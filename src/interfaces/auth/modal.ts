import { IModalBaseProps, } from '../shared/modal';

export interface ILogInModalProps extends IModalBaseProps {
  /** Called once the success message has been shown and the modal closes */
  onAuthenticated?: () => void;
};
export interface ILogOutModalProps extends IModalBaseProps {};
