'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SCREEN_TRANSITION, SCREEN_VARIANTS } from '@/lib/modal-screens';
import type { ILessonGroup, ILessonGroupModalProps } from '@/interfaces/lessons/lesson-group';
import Modal from '@/components/ui/Modal';
import { lessonGroupSchema, type TLessonGroupForm } from './lesson-group.scheme';
import LessonGroupOverview from './components/LessonGroupOverview';
import LessonGroupLessons from './components/LessonGroupLessons';

import styles from './styles.module.scss';

type TScreen = 'overview' | 'lessons';

const LessonGroupContent = ({ group, canManage, onDelete, onClose, }: Omit<ILessonGroupModalProps, 'isOpen' | 'group'> & { group: ILessonGroup }) => {
  const [screen, setScreen] = useState<TScreen>('overview');
  const methods = useForm<TLessonGroupForm>({
    resolver: zodResolver(lessonGroupSchema),
    mode: 'onTouched',
    defaultValues: { name: group.name, note: group.note ?? '', },
  });
  const isReducedMotion = useReducedMotion();
  const direction = isReducedMotion ? 0 : screen === 'lessons' ? 1 : -1;

  return (
    <AnimatePresence mode={'wait'} initial={false} custom={direction}>
      <motion.div
        key={screen}
        className={styles.screen}
        custom={direction}
        variants={SCREEN_VARIANTS}
        initial={'enter'}
        animate={'center'}
        exit={'exit'}
        transition={SCREEN_TRANSITION}
      >
        {screen === 'overview'
          ? (
            <LessonGroupOverview
              group={group}
              canManage={canManage}
              methods={methods}
              onOpenLessons={() => setScreen('lessons')}
              onDelete={onDelete}
              onClose={onClose}
            />
          )
          : (
            <LessonGroupLessons
              group={group}
              canManage={canManage}
              onBack={() => setScreen('overview')}
            />
          )}
      </motion.div>
    </AnimatePresence>
  );
}

/** A lesson group in the admin panel: details first, its lessons on a screen of their own */
const LessonGroupModal = ({ isOpen, group, ...props }: ILessonGroupModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={props.onClose} size={'lg'}>
      {group && <LessonGroupContent group={group} {...props} />}
    </Modal>
  );
}

export default LessonGroupModal;
