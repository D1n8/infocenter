import Button from 'components/Button';

import styles from './Section.module.scss';

type SectionType = {
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

function Section({ title, children, onClick }: SectionType) {
  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <h2 className={styles.title}>{title}</h2>
        <Button onClick={onClick} children={'Загрузить данные'} />
      </div>
      {children}
    </section>
  );
}

export default Section;
