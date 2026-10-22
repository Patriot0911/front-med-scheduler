import type { PropsWithChildren, ReactNode } from 'react';

import styles from './styles.module.scss';

interface IProfileSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
  /** Submit button, pinned to the bottom so both columns line up */
  action: ReactNode;
};

const ProfileSection = ({ title, description, action, children, }: IProfileSectionProps) => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={styles.fields}>
        {children}
      </div>
      <div className={styles.action}>
        {action}
      </div>
    </section>
  );
}

export default ProfileSection;
