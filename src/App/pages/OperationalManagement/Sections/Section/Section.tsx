import classNames from 'classnames';
import Button from 'components/Button';
import MaximizeButton from 'components/IconButtons/MaximizeButton';
import MinimizeButton from 'components/IconButtons/MinimizeButton';

import styles from './Section.module.scss';

type SectionType = {
  isMaximize: boolean;
  setIsMaximize: (flag: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

function Section({ isMaximize, setIsMaximize, title, children, onClick }: SectionType) {
  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          {isMaximize ? (
            <MaximizeButton
              onClick={() => setIsMaximize(false)}
              className={classNames(styles.sizeBtn, styles.maxBtn)}
            />
          ) : (
            <MinimizeButton
              onClick={() => setIsMaximize(true)}
              className={classNames(styles.sizeBtn, styles.minBtn)}
            />
          )}
        </div>
        <Button onClick={onClick} children={'Настроить графики'} />
      </div>
      <div className={styles.sectionContainer}>{children}</div>
    </section>
  );
}

export default Section;
