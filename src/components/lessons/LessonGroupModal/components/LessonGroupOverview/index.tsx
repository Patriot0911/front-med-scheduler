'use client';

import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuTrash2 } from 'react-icons/lu';
import useEditLessonGroupMutation from '@/hooks/mutations/lessons/useEditLessonGroupMutation';
import type { ILessonGroupOverviewProps } from '@/interfaces/lessons/lesson-group';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import type { TLessonGroupForm } from '../../lesson-group.scheme';
import { formatGroupPeriod } from '../../lesson-group-text';

import styles from './styles.module.scss';

const LessonGroupOverview = ({ group, canManage, canManageLessons, methods, onOpenLessons, onDelete, onClose, }: ILessonGroupOverviewProps) => {
  const { t, } = useTranslation(['lessons', 'common']);
  const mutation = useEditLessonGroupMutation(onClose);
  const onSubmit = (form: TLessonGroupForm) => mutation.mutate({
    lessonGroupId: group.id,
    payload: { name: form.name.trim(), note: form.note.trim(), },
  });
  const stats = [
    { label: t('groups.overview.count'), value: t('count', { count: group.lessonsCount, }), },
    { label: t('groups.overview.period'), value: formatGroupPeriod(group) ?? '—', },
  ];
  const owner = [group.departmentName, group.createdByTeacherName && t('groups.overview.createdBy', { name: group.createdByTeacherName, })]
    .filter(Boolean).join(' · ');
  const description = canManage
    ? [owner, t('groups.overview.editDescription')].filter(Boolean).join('. ')
    : owner || t('groups.overview.fallback');

  return (
    <Modal.FormBody methods={canManage ? methods : undefined} onSubmit={methods.handleSubmit(onSubmit)}>
      <Modal.Header
        title={group.name}
        description={description}
        actions={canManage && (
          <button type={'button'} className={styles['delete-button']} onClick={() => onDelete(group)}>
            <LuTrash2 />
            <span>{t('groups.delete')}</span>
          </button>
        )}
      />
      <Modal.Content className={styles.content}>
        {canManage
          ? (
            <div className={styles.fields}>
              <FormInput<TLessonGroupForm> name={'name'} label={t('groups.overview.name')} required disabled={mutation.isPending} />
              <FormTextarea<TLessonGroupForm> name={'note'} label={t('groups.overview.note')} placeholder={t('groups.overview.notePlaceholder')} maxRows={4} disabled={mutation.isPending} />
            </div>
          )
          : group.note && <p className={styles.note}>{group.note}</p>}

        <section className={styles.lessons} aria-labelledby={'group-lessons-title'}>
          <div className={styles['lessons-header']}>
            <h3 id={'group-lessons-title'} className={styles.title}>{t('groups.overview.lessons')}</h3>
            <Button variant={'secondary'} rightIcon={<LuArrowRight />} onClick={onOpenLessons}>
              {canManageLessons ? t('groups.overview.editLessons') : t('groups.overview.viewLessons')}
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
          {canManage ? t('common:actions.cancel') : t('common:actions.close')}
        </Button>
        {canManage && (
          <Button
            type={'submit'}
            className={'flex-1'}
            disabled={!methods.formState.isDirty}
            isLoading={mutation.isPending}
          >
            {t('common:actions.saveChanges')}
          </Button>
        )}
      </Modal.Footer>
    </Modal.FormBody>
  );
}

export default LessonGroupOverview;
