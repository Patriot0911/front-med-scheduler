import styles from './styles.module.scss';

interface IChipsCellProps {
  items: string[];
  /** How many chips to show before collapsing the rest into "+N" */
  limit?: number;
  emptyText?: string;
};

const ChipsCell = ({ items, limit = 4, emptyText = '—' }: IChipsCellProps) => {
  if (items.length === 0) {
    return <span className={styles.empty}>{emptyText}</span>;
  }

  const visible = items.slice(0, limit);
  const hidden = items.slice(limit);

  return (
    <div className={styles.chips}>
      {visible.map((item) => (
        <span key={item} className={styles.chip}>{item}</span>
      ))}
      {hidden.length > 0 && (
        <span className={styles.more} title={hidden.join(', ')}>+{hidden.length}</span>
      )}
    </div>
  );
}

export default ChipsCell;
