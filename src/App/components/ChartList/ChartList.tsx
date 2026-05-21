import { useEffect, useState } from 'react';
import type { ChartListType } from 'types/index';

import ChartCard from '../ChartCard/ChartCard';

import styles from './ChartList.module.scss';

function ChartList({ isMaximize, cards }: ChartListType) {
  const [hasRenderedAll, setHasRenderedAll] = useState(isMaximize);

  useEffect(() => {
    if (isMaximize && !hasRenderedAll) {
      setHasRenderedAll(true);
    }
  }, [isMaximize, hasRenderedAll]);

  const renderedCards = hasRenderedAll ? cards : cards.slice(0, 3);

  return (
    <div className={styles.chartList}>
      {renderedCards.map((card, index) => {
        const isHidden = !isMaximize && index >= 3;

        return (
          <ChartCard
            key={card.id}
            id={card.id}
            data={card.data}
            config={card.config}
            isHidden={isHidden}
          />
        );
      })}
    </div>
  );
}

export default ChartList;
