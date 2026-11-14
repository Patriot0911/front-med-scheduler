'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { LuArrowLeft, LuPencil, LuPlus } from 'react-icons/lu';
import dayjs from '@/lib/dayjs';
import { getLessonStart } from '@/lib/lessons-calendar';
import type { ILesson } from '@/interfaces/lessons/lesson';
import type { IWeekLessonsModalProps } from '@/interfaces/lessons/modal';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LessonDetails from '../LessonDetails';

import styles from './styles.module.scss';

const names = (items: { name: string }[]) => items.map(({ name, }) => name).join(', ');

// list ↔ lesson: the next screen comes from the side it leads to (lesson: right, back: left)
const SHIFT_PX = 32;
const screenVariants: Variants = {
  enter: (direction: number) => ({ x: direction * SHIFT_PX, opacity: 0, }),
  center: { x: 0, opacity: 1, },
  exit: (direction: number) => ({ x: -direction * SHIFT_PX, opacity: 0, }),
};

/** The lessons of one week by day; a lesson opens right here, with Back to the list */
const WeekLessonsModal = ({ isOpen, onClose, weekStart, lessons, onEdit, onCreate, }: IWeekLessonsModalProps) => {
  const [selected, setSelected] = useState<ILesson | null>(null);
  // 1: to the lesson, -1: back to the list; 0 without motion
  const [direction, setDirection] = useState(1);
  const isReducedMotion = useReducedMotion();
  const open = (lesson: ILesson | null) => {
    setDirection(lesson ? 1 : -1);
    setSelected(lesson);
  };
  const first = dayjs(weekStart ?? new Date()).startOf('day');
  const last = first.add(6, 'day');

  const days = Array.from({ length: 7, }, (_, index) => first.add(index, 'day'))
    .map((day) => ({
      day,
      lessons: lessons
        .filter((lesson) => getLessonStart(lesson).isSame(day, 'day'))
        .sort((a, b) => getLessonStart(a).valueOf() - getLessonStart(b).valueOf()),
    }))
    .filter(({ lessons: dayLessons, }) => dayLessons.length > 0);
  const lessonsCount = days.reduce((count, { lessons: dayLessons, }) => count + dayLessons.length, 0);

  const close = () => {
    onClose();
    setSelected(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size={'md'}>
      <AnimatePresence mode={'wait'} initial={false} custom={isReducedMotion ? 0 : direction}>
        <motion.div
          key={selected?.id ?? 'week'}
          className={styles.screen}
          custom={isReducedMotion ? 0 : direction}
          variants={screenVariants}
          initial={'enter'}
          animate={'center'}
          exit={'exit'}
          transition={{ duration: 0.18, ease: 'easeOut', }}
        >
          {selected
            ? (
              <>
                <Modal.Header title={selected.name} description={selected.lessonGroupName ?? undefined} />
                <Modal.Content>
                  <LessonDetails lesson={selected} />
                </Modal.Content>
                <Modal.Footer>
                  <Button className={'flex-1'} variant={'secondary'} leftIcon={<LuArrowLeft />} onClick={() => open(null)}>
                    Back
                  </Button>
                  {onEdit && selected.canEdit && (
                    <Button className={'flex-1'} variant={'primary'} leftIcon={<LuPencil />} onClick={() => onEdit(selected)}>
                      Edit
                    </Button>
                  )}
                </Modal.Footer>
              </>
            )
            : (
              <>
                <Modal.Header
                  title={`${first.format('DD MMM')} – ${last.format(first.isSame(last, 'month') ? 'DD' : 'DD MMM')} ${last.format('YYYY')}`}
                  description={lessonsCount ? `${lessonsCount} ${lessonsCount === 1 ? 'lesson' : 'lessons'} this week` : undefined}
                />
                <Modal.Content>
                  {days.length === 0 && <p className={styles.empty}>No lessons this week.</p>}
                  {days.map(({ day, lessons: dayLessons, }) => (
                    <section key={day.valueOf()} className={styles.day}>
                      <h4 className={styles['day-title']}>{day.format('dddd, DD MMMM')}</h4>
                      <ul className={styles.list}>
                        {dayLessons.map((lesson) => {
                          const start = getLessonStart(lesson);
                          return (
                            <li key={lesson.id}>
                              <button type={'button'} className={styles.item} onClick={() => open(lesson)}>
                                <span className={styles.time}>
                                  {start.format('HH:mm')}–{start.add(lesson.duration, 'minute').format('HH:mm')}
                                </span>
                                <span className={styles.info}>
                                  <span className={styles.name}>{lesson.name}</span>
                                  <span className={styles.meta}>
                                    {[names(lesson.studentGroups), names(lesson.teachers)].filter(Boolean).join(' · ')}
                                  </span>
                                </span>
                                {lesson.canEdit && onEdit && <span className={styles.editable}>Yours</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </Modal.Content>
                <Modal.Footer>
                  <Button className={'flex-1'} variant={'secondary'} onClick={close}>
                    Close
                  </Button>
                  {onCreate && (
                    <Button className={'flex-1'} variant={'primary'} leftIcon={<LuPlus />} onClick={onCreate}>
                      Add lesson
                    </Button>
                  )}
                </Modal.Footer>
              </>
            )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default WeekLessonsModal;
