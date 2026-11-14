import { IModalHeaderProps } from '@/interfaces/shared/modal';
import styles from './styles.module.scss';

const ModalHeader = ({ description, title, actions, }: IModalHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <span className={styles.headerTitle}>
          {title}
        </span>
        {!!description && (
          <p className={styles.headerSub}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}

export default ModalHeader;
