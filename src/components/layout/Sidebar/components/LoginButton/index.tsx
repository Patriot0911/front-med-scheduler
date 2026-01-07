import LogInModal from '@/components/auth/LogInModal';
import Button from '@/components/ui/Button';
import { useState } from 'react';

import styles from './styles.module.scss';
import { FaUserGraduate } from 'react-icons/fa';

const LoginButton = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div className={styles['login-wrapper']}>
      <LogInModal isOpen={isShowModal} onClose={() => setIsShowModal(false)} />
      <Button onClick={() => setIsShowModal(true)} leftIcon={FaUserGraduate({})}>
        Sign in
      </Button>
    </div>
  );
}

export default LoginButton;
