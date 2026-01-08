import AuthModal from '@/components/auth/AuthModal';
import { FaUserGraduate } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useState } from 'react';

import styles from './styles.module.scss';

const LoginButton = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div className={styles['login-wrapper']}>
      <AuthModal isOpen={isShowModal} onClose={() => setIsShowModal(false)} />
      <Button onClick={() => setIsShowModal(true)} leftIcon={FaUserGraduate({})}>
        Sign In
      </Button>
    </div>
  );
}

export default LoginButton;
