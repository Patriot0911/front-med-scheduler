import LogInModal from '@/components/auth/LogInModal';
import { useState } from 'react';

const LoginButton = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <>
      <LogInModal isOpen={isShowModal} onClose={() => setIsShowModal(false)} />
      <button onClick={() => setIsShowModal(true)}>Login</button>
    </>
  );
}

export default LoginButton;
