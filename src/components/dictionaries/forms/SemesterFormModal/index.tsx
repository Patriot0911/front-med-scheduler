'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, TSemesterForm } from './semester.scheme';
import dayjs from '@/lib/dayjs';
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
  const { t, } = useTranslation('dictionaries');
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
    successMessage: item ? t('semesters.updated') : t('semesters.created'),
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
      title={item ? t('semesters.form.editTitle') : t('semesters.form.createTitle')}
      description={item ? t('semesters.form.editDescription') : t('semesters.form.createDescription')}
      methods={methods}
      onSubmit={(data: TSemesterForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TSemesterForm>
        name={'name'}
        label={t('fields.name')}
        placeholder={t('semesters.form.namePlaceholder')}
        required
      />
      <FormInput<TSemesterForm>
        name={'dateFrom'}
        label={t('semesters.form.dateFrom')}
        type={'date'}
        required
      />
      <FormInput<TSemesterForm>
        name={'dateTo'}
        label={t('semesters.form.dateTo')}
        type={'date'}
        required
      />
    </DictionaryModal>
  );
}

export default SemesterFormModal;
