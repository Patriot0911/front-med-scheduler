'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, TSemesterForm } from './semester.scheme';
import dayjs from 'dayjs';
import type { ISemester } from '@/interfaces/dictionaries/semesters';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import SemestersService, { SemestersQueryKey } from '@/lib/services/semesters.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';

const DATE_INPUT_FORMAT = 'YYYY-MM-DD';

const toFormValues = (semester: ISemester | null): TSemesterForm => ({
  name: semester?.name ?? '',
  dateFrom: semester ? dayjs(semester.dateFrom).format(DATE_INPUT_FORMAT) : '',
  dateTo: semester ? dayjs(semester.dateTo).format(DATE_INPUT_FORMAT) : '',
});

const SemesterFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<ISemester>) => {
  const methods = useForm<TSemesterForm>({
    resolver: zodResolver(semesterSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });

  const mutation = useDictionaryMutation({
    mutationFn: (data: TSemesterForm) => item
      ? SemestersService.editSemester(item.id, data)
      : SemestersService.createSemester(data),
    invalidateKeys: [SemestersQueryKey.SemestersList],
    successMessage: item ? 'Semester updated' : 'Semester created',
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues(item));
      mutation.reset();
    }
  }, [isOpen, item]);

  return (
    <DictionaryModal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit semester' : 'New semester'}
      methods={methods}
      onSubmit={(data: TSemesterForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TSemesterForm>
        name={'name'}
        label={'Name'}
        placeholder={'e.g. Перший навчальний семестр 2025-2026'}
        required
      />
      <FormInput<TSemesterForm>
        name={'dateFrom'}
        label={'Starts on'}
        type={'date'}
        required
      />
      <FormInput<TSemesterForm>
        name={'dateTo'}
        label={'Ends on'}
        type={'date'}
        required
      />
    </DictionaryModal>
  );
}

export default SemesterFormModal;
