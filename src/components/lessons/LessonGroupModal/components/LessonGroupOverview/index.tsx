'use client';

import { LuArrowRight, LuTrash2 } from 'react-icons/lu';
import useEditLessonGroupMutation from '@/hooks/mutations/lessons/useEditLessonGroupMutation';
import type { ILessonGroupOverviewProps } from '@/interfaces/lessons/lesson-group';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import type { TLessonGroupForm } from '../../lesson-group.scheme';
import { formatGroupPeriod, pluralLessons } from '../../lesson-group-text';

import styles from './styles.module.scss';

const LessonGroupOverview = ({ group, canManage, methods, onOpenLessons, onDelete, onClose, }: ILessonGroupOverviewProps) => {
  const mutation = useEditLessonGroupMutation(onClose);
  const onSubmit = (form: TLessonGroupForm) => mutation.mutate({
    lessonGroupId: group.id,
    payload: { name: form.name.trim(), note: form.note.trim(), },
  });
  const stats = [
    { label: 'Count', value: pluralLessons(group.lessonsCount), },
    { label: 'Period', value: formatGroupPeriod(group) ?? '—', },
  ];
  const owner = [group.departmentName, group.createdByTeacherName && `created by ${group.createdByTeacherName}`]
    .filter(Boolean).join(' · ');

  return (
    <Modal.FormBody methods={canManage ? methods : undefined} onSubmit={methods.handleSubmit(onSubmit)}>
      <Modal.Header
        title={group.name}
        description={owner || 'Lesson group'}
        actions={canManage && (
          <button type={'button'} className={styles['delete-button']} onClick={() => onDelete(group)}>
            <LuTrash2 />
            <span>Delete group</span>
          </button>
        )}
      />
      <Modal.Content className={styles.content}>
        {canManage
          ? (
            <div className={styles.fields}>
              <FormInput<TLessonGroupForm> name={'name'} label={'Name'} required disabled={mutation.isPending} />
              <FormTextarea<TLessonGroupForm> name={'note'} label={'Note'} placeholder={'Optional'} maxRows={4} disabled={mutation.isPending} />
            </div>
          )
          : group.note && <p className={styles.note}>{group.note}</p>}

        <section className={styles.lessons} aria-labelledby={'group-lessons-title'}>
          <div className={styles['lessons-header']}>
            <h3 id={'group-lessons-title'} className={styles.title}>Lessons</h3>
            <Button variant={'secondary'} rightIcon={<LuArrowRight />} onClick={onOpenLessons}>
              {canManage ? 'Edit lessons' : 'View lessons'}
            </Button>
          </div>
          <dl className={styles.stats}>
            {stats.map(({ label, value, }) => (
              <div key={label} className={styles.stat}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Modal.Content>
      <Modal.Footer>
        <Button className={'flex-1'} variant={'secondary'} onClick={onClose} disabled={mutation.isPending}>
          {canManage ? 'Cancel' : 'Close'}
        </Button>
        {canManage && (
          <Button
            type={'submit'}
            className={'flex-1'}
            disabled={!methods.formState.isDirty}
            isLoading={mutation.isPending}
          >
            Save changes
          </Button>
        )}
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default LessonGroupOverview;
