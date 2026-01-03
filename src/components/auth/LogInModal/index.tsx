import { ILogInModalProps } from '@/interfaces/auth/modal';
import Modal from '@/components/ui/Modal';

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
