'use client';

import type { FieldValues } from 'react-hook-form';
import type { IDictionaryModalProps } from '@/interfaces/dictionaries/tables';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

/** Shared create / edit modal shell for dictionaries: header, form body and Cancel / Save footer. */
const DictionaryModal = <T extends FieldValues>({
  isOpen,
  onClose,
  title,
  description,
  methods,
  onSubmit,
  isPending,
  isEdit,
  children,
}: IDictionaryModalProps<T>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isLoading={isPending} size={'md'}>
      <Modal.FormBody methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Modal.Header title={title} description={description} />
        <Modal.Content>
          {children}
        </Modal.Content>
        <Modal.Footer>
          <Button
            className={'flex-1'}
            variant={'secondary'}
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className={'flex-1'}
            disabled={isPending || (isEdit && !methods.formState.isDirty)}
            isLoading={isPending}
          >
            {isEdit ? 'Save changes' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal.FormBody>
    </Modal>
  );
}

export default DictionaryModal;
