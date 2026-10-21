'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { LuCrown, LuPlus, LuSearch, LuX } from 'react-icons/lu';
import type { IDepartment } from '@/interfaces/dictionaries/departments';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import type { ITeacherDictionaryItem } from '@/interfaces/dictionaries/dictionary-items';
import DepartmentsService, { DepartmentsQueryKey } from '@/lib/services/departments.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import useTeachersDictionaryQuery from '@/hooks/queries/dictionaries/useTeachersDictionaryQuery';
import useDepartmentsDictionaryQuery from '@/hooks/queries/dictionaries/useDepartmentsDictionaryQuery';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TeacherList from '../../TeacherList';

import styles from './styles.module.scss';

const isSameSet = (a: string[], b: string[]) => a.length === b.length && a.every((id) => b.includes(id));

/** Composition of a department: search through all teachers and add / remove them. */
const DepartmentTeachersModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IDepartment>) => {
  const { data: teachers, isLoading, } = useTeachersDictionaryQuery(isOpen);
  const { data: departments, } = useDepartmentsDictionaryQuery(isOpen);
  const [search, setSearch] = useState('');
  // null until the user changes something, so the list follows the loaded data
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

  const teacherById = useMemo(
    () => new Map((teachers ?? []).map((teacher) => [teacher.id, teacher])),
    [teachers],
  );
  const departmentNameById = useMemo(
    () => new Map((departments ?? []).map((department) => [department.id, department.name])),
    [departments],
  );
  const initialIds = useMemo(
    () => (teachers ?? []).filter((teacher) => teacher.departmentId === item?.id).map((teacher) => teacher.id),
    [teachers, item],
  );

  const memberIds = selectedIds ?? initialIds;
  const members = memberIds
    .map((id) => teacherById.get(id))
    .filter((teacher): teacher is ITeacherDictionaryItem => !!teacher);
  const query = search.trim().toLowerCase();
  const candidates = (teachers ?? []).filter((teacher) => (
    !memberIds.includes(teacher.id) && (!query || teacher.name.toLowerCase().includes(query))
  ));

  const movedCount = members.filter((teacher) => isFromOtherDepartment(teacher)).length;
  const removedHead = item?.headTeacherId && initialIds.includes(item.headTeacherId) && !memberIds.includes(item.headTeacherId)
    ? teacherById.get(item.headTeacherId)
    : undefined;
  const isDirty = !isSameSet(memberIds, initialIds);

  const close = () => {
    setSearch('');
    setSelectedIds(null);
    onClose();
  };

  const mutation = useDictionaryMutation({
    mutationFn: (teacherIds: string[]) => DepartmentsService.setDepartmentTeachers(item!.id, teacherIds),
    invalidateKeys: [DepartmentsQueryKey.DepartmentsList, DictionaryQueryKey.Teachers],
    successMessage: 'Department teachers updated',
    onSuccess: close,
  });

  useEffect(() => {
    if (isOpen) {
      mutation.reset();
    }
  }, [isOpen, item]);

  function isFromOtherDepartment(teacher: ITeacherDictionaryItem) {
    return !!teacher.departmentId && teacher.departmentId !== item?.id;
  }

  const getDepartmentName = (departmentId: string) => departmentNameById.get(departmentId) ?? 'another department';

  const add = (id: string) => setSelectedIds([...memberIds, id]);
  const remove = (id: string) => setSelectedIds(memberIds.filter((memberId) => memberId !== id));

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (item && isDirty) {
      mutation.mutate(memberIds);
    }
  };

  const isLocked = mutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={close} isLoading={isLoading || mutation.isPending} size={'lg'}>
      <Modal.FormBody onSubmit={submitHandler}>
        <Modal.Header
          title={'Department teachers'}
          description={item?.name}
        />
        <Modal.Content>
          <div className={styles.columns}>
            <section className={styles.section}>
              <h3 className={styles.title}>
                In the department
                <span className={styles.count}>{members.length}</span>
              </h3>
              <TeacherList
                className={styles.list}
                isEmpty={!members.length}
                emptyText={'No teachers yet. Add them from the list.'}
              >
                {members.map((teacher) => (
                  <TeacherList.Item
                    key={teacher.id}
                    name={teacher.name}
                    badges={(
                      <>
                        {teacher.id === item?.headTeacherId && (
                          <TeacherList.Badge tone={'primary'}>
                            <LuCrown /> Head
                          </TeacherList.Badge>
                        )}
                        {isFromOtherDepartment(teacher) && (
                          <TeacherList.Badge tone={'warning'} title={'Will be moved to this department on save'}>
                            Moves from {getDepartmentName(teacher.departmentId!)}
                          </TeacherList.Badge>
                        )}
                        {!initialIds.includes(teacher.id) && !isFromOtherDepartment(teacher) && (
                          <TeacherList.Badge tone={'muted'}>New</TeacherList.Badge>
                        )}
                      </>
                    )}
                    action={(
                      <TeacherList.Action
                        icon={<LuX />}
                        label={`Remove ${teacher.name}`}
                        variant={'danger'}
                        disabled={isLocked}
                        onClick={() => remove(teacher.id)}
                      />
                    )}
                  />
                ))}
              </TeacherList>
            </section>

            <section className={styles.section}>
              <h3 className={styles.title}>Add teachers</h3>
              <Input
                name={'teacher-search'}
                value={search}
                placeholder={'Search by name…'}
                icon={<LuSearch />}
                autoComplete={'off'}
                disabled={isLocked}
                hideErrorMessage
                onChange={(e) => setSearch(e.target.value)}
                // Enter inside the search must not submit the form
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
              <TeacherList
                className={styles.list}
                isEmpty={!candidates.length}
                emptyText={query ? `Nothing found for “${search.trim()}”` : 'All teachers are already in the department'}
              >
                {candidates.map((teacher) => (
                  <TeacherList.Item
                    key={teacher.id}
                    name={teacher.name}
                    badges={isFromOtherDepartment(teacher)
                      ? <TeacherList.Badge tone={'warning'}>{getDepartmentName(teacher.departmentId!)}</TeacherList.Badge>
                      : !teacher.departmentId && <TeacherList.Badge>No department</TeacherList.Badge>}
                    action={(
                      <TeacherList.Action
                        icon={<LuPlus />}
                        label={`Add ${teacher.name}`}
                        disabled={isLocked}
                        onClick={() => add(teacher.id)}
                      />
                    )}
                  />
                ))}
              </TeacherList>
            </section>
          </div>

          {(movedCount > 0 || !!removedHead) && (
            <ul className={styles.notes}>
              {movedCount > 0 && (
                <li>
                  {movedCount === 1 ? '1 teacher' : `${movedCount} teachers`} will leave their current department.
                  A head of another department loses that role.
                </li>
              )}
              {!!removedHead && (
                <li>{removedHead.name} will no longer be the head of this department.</li>
              )}
            </ul>
          )}
        </Modal.Content>
        <Modal.Footer>
          <Button
            className={'flex-1'}
            variant={'secondary'}
            disabled={isLocked}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type={'submit'}
            className={'flex-1'}
            disabled={isLocked || !isDirty}
            isLoading={isLocked}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.FormBody>
    </Modal>
  );
}

export default DepartmentTeachersModal;
