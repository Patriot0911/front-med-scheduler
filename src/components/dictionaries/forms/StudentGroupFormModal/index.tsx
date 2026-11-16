'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentGroupSchema, TStudentGroupForm } from './student-group.scheme';
import type { IStudentGroup } from '@/interfaces/dictionaries/student-groups';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import StudentGroupsService, { StudentGroupsQueryKey } from '@/lib/services/student-groups.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useGroupTagsDictionaryQuery from '@/hooks/queries/dictionaries/useGroupTagsDictionaryQuery';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormCheckboxGroup from '@/components/ui/FormCheckboxGroup';

const toFormValues = (group: IStudentGroup | null): TStudentGroupForm => ({
  name: group?.name ?? '',
  studyYear: group?.studyYear ?? '',
  tagIds: group?.groupTags ?? [],
});

const StudentGroupFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IStudentGroup>) => {
  const { t, } = useTranslation('dictionaries');
  const { data: tags, } = useGroupTagsDictionaryQuery(isOpen);
  const methods = useForm<TStudentGroupForm>({
    resolver: zodResolver(studentGroupSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });

  const mutation = useDictionaryMutation({
    mutationFn: (data: TStudentGroupForm) => item
      ? StudentGroupsService.editStudentGroup(item.id, data)
      : StudentGroupsService.createStudentGroup(data),
    invalidateKeys: [StudentGroupsQueryKey.StudentGroupsList],
    successMessage: item ? t('studentGroups.updated') : t('studentGroups.created'),
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
      title={item ? t('studentGroups.form.editTitle') : t('studentGroups.form.createTitle')}
      description={item ? t('studentGroups.form.editDescription') : t('studentGroups.form.createDescription')}
      methods={methods}
      onSubmit={(data: TStudentGroupForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TStudentGroupForm>
        name={'name'}
        label={t('fields.name')}
        placeholder={t('studentGroups.form.namePlaceholder')}
        required
      />
      <FormInput<TStudentGroupForm>
        name={'studyYear'}
        label={t('studentGroups.form.studyYear')}
        placeholder={t('studentGroups.form.studyYearPlaceholder')}
        required
      />
      <FormCheckboxGroup<TStudentGroupForm>
        name={'tagIds'}
        label={t('studentGroups.form.tags')}
        options={(tags ?? []).map((tag) => ({ value: tag.id, label: tag.name, }))}
        emptyText={t('studentGroups.form.noTags')}
      />
    </DictionaryModal>
  );
}

export default StudentGroupFormModal;
