import ChartList from 'App/components/ChartList/ChartList';
import classNames from 'classnames';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import type { DropdownOption } from 'components/Dropdown/Dropdown';
import MaximizeButton from 'components/IconButtons/MaximizeButton';
import MinimizeButton from 'components/IconButtons/MinimizeButton';
import { useEffect, useState } from 'react';
import type { SectionType } from 'types/index';

import styles from './Section.module.scss';

const LIMIT_OPTIONS: DropdownOption[] = [
  { value: '6', label: 'Показать 6 графиков' },
  { value: '9', label: 'Показать 9 графиков' },
  { value: '12', label: 'Показать 12 графиков' },
  { value: 'all', label: 'Показать все графики' },
];

function Section({ isMaximize, setIsMaximize, cards, setCards, title, onClick }: SectionType) {
  const [hasRenderedAll, setHasRenderedAll] = useState(isMaximize);
  const [limit, setLimit] = useState<string>('6');

  useEffect(() => {
    if (isMaximize && !hasRenderedAll) {
      setHasRenderedAll(true);
    }
  }, [isMaximize, hasRenderedAll]);

  useEffect(() => {
    if (!isMaximize) {
      setLimit('6');
    }
  }, [isMaximize]);

  const handleLimitChange = (opt: DropdownOption) => {
    setLimit(String(opt.value));
  };

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

          {isMaximize && (
            <Dropdown
              id={`limit-select-${title}`}
              options={LIMIT_OPTIONS}
              value={limit}
              onChange={handleLimitChange}
            />
          )}
        </div>
        <Button onClick={onClick} children={'Настроить графики'} />
      </div>
      <ChartList isMaximize={isMaximize} cards={cards} setCards={setCards} limit={limit} />
    </section>
  );
}

export default Section;
