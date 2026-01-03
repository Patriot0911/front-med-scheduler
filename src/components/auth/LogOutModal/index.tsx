import { ILogOutModalProps } from '@/interfaces/auth/modal';
import Modal from '@/components/ui/Modal';

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
