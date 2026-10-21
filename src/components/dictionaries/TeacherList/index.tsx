import { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

interface ITeacherListProps extends PropsWithChildren {
  isEmpty: boolean;
  emptyText: string;
  className?: string;
};

interface ITeacherListItemProps {
  name: string;
  badges?: ReactNode;
  /** e.g. an add / remove icon button */
  action?: ReactNode;
};

interface ITeacherListBadgeProps extends PropsWithChildren {
  tone?: 'primary' | 'warning' | 'muted';
  title?: string;
};

interface ITeacherListActionProps {
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'danger';
  disabled?: boolean;
  onClick: () => void;
};

const TeacherList = ({ isEmpty, emptyText, className, children }: ITeacherListProps) => {
  if (isEmpty) {
    return <p className={cn(styles.empty, className)}>{emptyText}</p>;
  }

  return <ul className={cn(styles.list, className)}>{children}</ul>;
}

const TeacherListItem = ({ name, badges, action }: ITeacherListItemProps) => (
  <li className={styles.item}>
    <span className={styles.name}>{name}</span>
    {!!badges && <span className={styles.badges}>{badges}</span>}
    {action}
  </li>
);

const TeacherListBadge = ({ tone = 'muted', title, children }: ITeacherListBadgeProps) => (
  <span className={cn(styles.badge, styles[`badge__${tone}`])} title={title}>{children}</span>
);

const TeacherListAction = ({ icon, label, variant = 'primary', disabled, onClick }: ITeacherListActionProps) => (
  <button
    type={'button'}
    className={cn(styles.action, styles[`action__${variant}`])}
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={onClick}
  >
    {icon}
  </button>
);

TeacherList.Item = TeacherListItem;
TeacherList.Badge = TeacherListBadge;
TeacherList.Action = TeacherListAction;

export default TeacherList;
