'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IStudentGroup } from '@/interfaces/dictionaries/student-groups';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import StudentGroupsService, { StudentGroupsQueryKey } from '@/lib/services/student-groups.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useGroupTagsDictionaryQuery from '@/hooks/queries/dictionaries/useGroupTagsDictionaryQuery';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormCheckboxGroup from '@/components/ui/FormCheckboxGroup';

const studentGroupSchema = z.object({
  name: z.string().trim().min(3, 'Min 3 chars'),
  studyYear: z.string().trim().min(1, 'Required'),
  tagIds: z.array(z.string()),
});

type TStudentGroupForm = z.infer<typeof studentGroupSchema>;

const toFormValues = (group: IStudentGroup | null): TStudentGroupForm => ({
  name: group?.name ?? '',
  studyYear: group?.studyYear ?? '',
  tagIds: group?.groupTags ?? [],
});

const StudentGroupFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IStudentGroup>) => {
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
    successMessage: item ? 'Group updated' : 'Group created',
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
      title={item ? 'Edit student group' : 'New student group'}
      methods={methods}
      onSubmit={(data: TStudentGroupForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TStudentGroupForm>
        name={'name'}
        label={'Name'}
        placeholder={'e.g. IXXX-123'}
        required
      />
      <FormInput<TStudentGroupForm>
        name={'studyYear'}
        label={'Study year'}
        placeholder={'e.g. 1 курс, Магістратура'}
        required
      />
      <FormCheckboxGroup<TStudentGroupForm>
        name={'tagIds'}
        label={'Tags'}
        options={(tags ?? []).map((tag) => ({ value: tag.id, label: tag.name, }))}
        emptyText={'No tags yet — create them in the "Group tags" tab'}
      />
    </DictionaryModal>
  );
}

export default StudentGroupFormModal;
