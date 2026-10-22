import type { PropsWithChildren, ReactNode } from 'react';

import styles from './styles.module.scss';

interface IProfileSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
  /** Shown next to the title, e.g. the "Edit" button of the view mode */
  headerAction?: ReactNode;
};

const ProfileSection = ({ title, description, headerAction, children, }: IProfileSectionProps) => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {headerAction}
      </header>
      {children}
    </section>
  );
}

export default ProfileSection;
