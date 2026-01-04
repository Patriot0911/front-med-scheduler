import type { ILogInModalProps } from '@/interfaces/auth/modal';
import { register } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import Modal from '@/components/ui/Modal';
import { useUserSelector } from '@/hooks/redux/auth';

const LogInModal = (props: ILogInModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useUserSelector);

  const loginHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email: 'us2fwwffer@example.com' , password: 'password123', fullName: 'Qwerty Bane' }));
  };

  return (
    <Modal {...props}>
      <form onSubmit={loginHandler}>
        {user?.fullName}
        <button type="submit">Log In</button>
      </form>
    </Modal>
  );
}

export default LogInModal;
