import ChartList from 'App/components/ChartList/ChartList';
import classNames from 'classnames';
import Button from 'components/Button';
import MaximizeButton from 'components/IconButtons/MaximizeButton';
import MinimizeButton from 'components/IconButtons/MinimizeButton';
import { useEffect, useState } from 'react';
import type { SectionType } from 'types/index';

import styles from './Section.module.scss';

function Section({ isMaximize, setIsMaximize, cards, setCards, title, onClick }: SectionType) {
  const [hasRenderedAll, setHasRenderedAll] = useState(isMaximize);

  useEffect(() => {
    if (isMaximize && !hasRenderedAll) {
      setHasRenderedAll(true);
    }
  }, [isMaximize, hasRenderedAll]);

  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          {isMaximize ? (
            <MinimizeButton
              onClick={() => setIsMaximize(false)}
              className={classNames(styles.sizeBtn, styles.minBtn)}
            />
          ) : (
            <MaximizeButton
              onClick={() => setIsMaximize(true)}
              className={classNames(styles.sizeBtn, styles.maxBtn)}
            />
          )}
        </div>
        <Button onClick={onClick} children={'Настроить графики'} />
      </div>
      <ChartList isMaximize={isMaximize} cards={cards} setCards={setCards} />
    </section>
  );
}

export default Section;
