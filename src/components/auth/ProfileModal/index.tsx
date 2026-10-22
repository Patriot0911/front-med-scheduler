'use client';

import { IProfileModalProps } from '@/interfaces/auth/profile';
import useMeQuery from '@/hooks/queries/auth/useMeQuery';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ProfileDataForm from './ProfileDataForm';
import ChangePasswordForm from './ChangePasswordForm';

import styles from './styles.module.scss';


const ProfileModal = ({ isOpen, onClose, }: IProfileModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <Modal.Header title={'Profile'} />
      <div className={styles.columns}>
        <ProfileDataForm className={styles.column} />
        <ChangePasswordForm className={styles.column} />
      </div>
      <Modal.Footer>
        <Button variant={'secondary'} onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileModal;
