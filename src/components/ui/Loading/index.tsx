import styles from './styles.module.scss';

const Loading = () => {
  return (
    <div className={styles.container} role={'status'} aria-label={'Loading'}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loading;
