'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuCrown, LuGraduationCap } from 'react-icons/lu';
import { departmentSchema, TDepartmentForm } from './department.scheme';
import type { IDepartment } from '@/interfaces/dictionaries/departments';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import DepartmentsService, { DepartmentsQueryKey } from '@/lib/services/departments.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import Button from '@/components/ui/Button';
import TeacherList from '../../TeacherList';
import DepartmentTeachersModal from '../DepartmentTeachersModal';

import styles from './styles.module.scss';

const NO_HEAD_OPTION: ISelectOption = { value: '', label: 'Not assigned', };

const toFormValues = (department: IDepartment | null): TDepartmentForm => ({
  name: department?.name ?? '',
  headTeacherId: department?.headTeacherId ?? '',
});

const DepartmentFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IDepartment>) => {
  // the teachers modal replaces this one while open, the form state is kept meanwhile
  const [isTeachersOpen, setIsTeachersOpen] = useState(false);

  // the head can only be one of the department's teachers, so it is set when editing
  const { data: teachers, } = useTeachersDictionaryQuery(isOpen && !!item);
  const departmentTeachers = (teachers ?? []).filter((teacher) => teacher.departmentId === item?.id);
  const headOptions: ISelectOption[] = [
    NO_HEAD_OPTION,
    ...departmentTeachers.map((teacher) => ({ value: teacher.id, label: teacher.name, })),
  ];

  const methods = useForm<TDepartmentForm>({
    resolver: zodResolver(departmentSchema),
    mode: 'onTouched',
    defaultValues: toFormValues(item),
  });
  const headTeacherId = methods.watch('headTeacherId');

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
    invalidateKeys: [DepartmentsQueryKey.DepartmentsList, DictionaryQueryKey.Departments],
    successMessage: item ? 'Department updated' : 'Department created',
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues(item));
      mutation.reset();
    } else {
      setIsTeachersOpen(false);
    }
  }, [isOpen, item]);

  // the head was removed from the department in the teachers modal
  useEffect(() => {
    if (teachers && headTeacherId && !departmentTeachers.some((teacher) => teacher.id === headTeacherId)) {
      methods.setValue('headTeacherId', '');
    }
  }, [teachers, headTeacherId]);

  return (
    <>
      <DictionaryModal
        isOpen={isOpen && !isTeachersOpen}
        onClose={onClose}
        title={item ? 'Edit department' : 'New department'}
        description={item ? undefined : 'Teachers and the head of the department can be assigned once it is created.'}
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
          <>
            <FormSelect<TDepartmentForm, ISelectOption>
              name={'headTeacherId'}
              label={'Head of the department'}
              options={headOptions}
              placeholder={'Not assigned'}
              hint={headOptions.length === 1 ? 'No teachers in this department yet' : 'Only teachers of this department'}
              disabled={headOptions.length === 1}
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

            <section className={styles.teachers}>
              <div className={styles['teachers-header']}>
                <span className={styles['teachers-title']}>
                  Teachers
                  <span className={styles.count}>{departmentTeachers.length}</span>
                </span>
              </div>
              <TeacherList
                className={styles['teachers-list']}
                isEmpty={!departmentTeachers.length}
                emptyText={'No teachers in this department yet'}
              >
                {departmentTeachers.map((teacher) => (
                  <TeacherList.Item
                    key={teacher.id}
                    name={teacher.name}
                    badges={teacher.id === headTeacherId && (
                      <TeacherList.Badge tone={'primary'}>
                        <LuCrown /> Head
                      </TeacherList.Badge>
                    )}
                  />
                ))}
              </TeacherList>
              <Button
                size={'sm'}
                variant={'primary'}
                leftIcon={<LuGraduationCap />}
                disabled={mutation.isPending}
                onClick={() => setIsTeachersOpen(true)}
              >
                Manage teachers
              </Button>
            </section>
          </>
        )}
      </DictionaryModal>

      {!!item && (
        <DepartmentTeachersModal
          isOpen={isOpen && isTeachersOpen}
          item={item}
          onClose={() => setIsTeachersOpen(false)}
        />
      )}
    </>
  );
}

export default DepartmentFormModal;
