'use client';

import { useEffect, useState } from 'react';
import { LoadingState, LoadingStateVariantsMap } from '@/lib/loading-mappers';
import { ConfirmModalButtonDictionary } from '@/configs/modal.dictionary';
import { IConfirmModalProps } from '@/interfaces/shared/modal';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

import styles from './styles.module.scss';

const ConfirmModal = (props: IConfirmModalProps) => {
  const [confirmWord, setConfirmWord] = useState<string>('')

  useEffect(() => {
    if (!props.isOpen) {
      setConfirmWord('');
    }
  }, [props.isOpen]);

  return (
    <Modal
      {...props}
      isLoading={props.requestState === LoadingState.Loading}
    >
      <form onSubmit={props.onConfirm} className={styles['confirm-form']}>
        <span className={styles['confirm-title']}>Confirmation</span>
        <div className={styles['confirm-inputs']}>
          {!!props.description && <p>{props.description}</p>}
          {!!props.confirmationWord && (
            <Input
              name={'confirmWord'}
              label='Confirmation word'
              placeholder={props.confirmationWord}
              onChange={(e) => setConfirmWord(e.target.value)}
              disabled={!!props.requestState && props.requestState !== LoadingState.Ide}
            />
          )}
        </div>
        <Button
          type='submit'
          disabled={
            (!!props.confirmationWord && props.confirmationWord !== confirmWord)
            || props.requestState !== LoadingState.Ide
            || props.disabled
          }
          variant={LoadingStateVariantsMap[props.requestState ?? LoadingState.Ide]}
        >
          {ConfirmModalButtonDictionary[props.requestState ?? LoadingState.Ide]}
        </Button>
      </form>
    </Modal>
  );
}

export default ConfirmModal;
