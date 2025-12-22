import { ILogInModalProps } from '@/src/interfaces/auth/modal';
import Modal from '../../ui/Modal';

const LogInModal = (props: ILogInModalProps) => {
  return (
    <Modal {...props}>
      <form>
        test
      </form>
    </Modal>
  );
}

export default LogInModal;
