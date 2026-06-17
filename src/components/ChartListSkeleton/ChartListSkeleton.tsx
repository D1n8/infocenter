import styles from './ChartListSkeleton.module.scss';

export default function ChartListSkeleton() {
  return (
    <div className={styles.skeletonList}>
      {[1, 2, 3].map((item) => (
        <div key={item} className={styles.skeletonCard} />
      ))}
    </div>
  );
}
