'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IDepartment } from '@/interfaces/dictionaries/departments';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import DepartmentsService, { DepartmentsQueryKey } from '@/lib/services/departments.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';

const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Min 2 chars'),
  // '' = no head
  headTeacherId: z.string(),
});

type TDepartmentForm = z.infer<typeof departmentSchema>;

const NO_HEAD_OPTION: ISelectOption = { value: '', label: 'Not assigned', };

const toFormValues = (department: IDepartment | null): TDepartmentForm => ({
  name: department?.name ?? '',
  headTeacherId: department?.headTeacherId ?? '',
});

const DepartmentFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IDepartment>) => {
  // the head can only be one of the department's teachers, so it is set when editing
  const { data: teachers, } = useTeachersDictionaryQuery(isOpen && !!item);
  const headOptions: ISelectOption[] = [
    NO_HEAD_OPTION,
    ...(teachers ?? [])
      .filter((teacher) => teacher.departmentId === item?.id)
      .map((teacher) => ({ value: teacher.id, label: teacher.name, })),
  ];

  const methods = useForm<TDepartmentForm>({
    resolver: zodResolver(departmentSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });

  const mutation = useDictionaryMutation({
    mutationFn: async ({ name, headTeacherId, }: TDepartmentForm) => {
      if (!item) {
        return DepartmentsService.createDepartment({ name, });
      }
      if (name !== item.name) {
        await DepartmentsService.editDepartment(item.id, { name, });
      }
      if (headTeacherId !== (item.headTeacherId ?? '')) {
        await DepartmentsService.setDepartmentHead(item.id, headTeacherId || null);
      }
      return true;
    },
    invalidateKeys: [DepartmentsQueryKey.DepartmentsList],
    successMessage: item ? 'Department updated' : 'Department created',
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
      title={item ? 'Edit department' : 'New department'}
      description={item ? undefined : 'The head of the department can be assigned once the department has teachers.'}
      methods={methods}
      onSubmit={(data: TDepartmentForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TDepartmentForm>
        name={'name'}
        label={'Name'}
        placeholder={'e.g. Кафедра внутрішньої медицини'}
        required
      />
      {!!item && (
        <FormSelect<TDepartmentForm, ISelectOption>
          name={'headTeacherId'}
          label={'Head of the department'}
          options={headOptions}
          placeholder={'Not assigned'}
          hint={headOptions.length === 1 ? 'No teachers in this department yet' : 'Only teachers of this department'}
          searchable
        >
          <FormSelect.Selected<ISelectOption>>
            {(option) => option.label}
          </FormSelect.Selected>
          <FormSelect.Area>
            <FormSelect.Search placeholder={'Search teacher…'} />
            <FormSelect.Option<ISelectOption>>
              {(option) => option.label}
            </FormSelect.Option>
          </FormSelect.Area>
        </FormSelect>
      )}
    </DictionaryModal>
  );
}

export default DepartmentFormModal;
