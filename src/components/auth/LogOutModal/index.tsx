import { ILogOutModalProps } from '@/src/interfaces/auth/modal';
import Modal from '../../ui/Modal';

const LogOutModal = (props: ILogOutModalProps) => {
  return (
    <Modal {...props}>
      <form>
        test
      </form>
    </Modal>
  );
}

export default LogOutModal;
