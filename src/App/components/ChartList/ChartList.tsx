import type { ChartListType } from 'types/index';

import ChartCard from '../ChartCard/ChartCard';

import styles from './ChartList.module.scss';

function ChartList({ isMaximize, cards, limit = '6' }: ChartListType) {
  const currentLimit = isMaximize ? (limit === 'all' ? cards.length : Number(limit)) : 3;

  const renderedCards = cards.slice(0, currentLimit);

  return (
    <div className={styles.chartList}>
      {renderedCards.map((card) => {
        return (
          <ChartCard
            key={card.id}
            id={card.id}
            data={card.data}
            config={card.config}
            isHidden={false}
          />
        );
      })}
    </div>
  );
}

export default ChartList;
