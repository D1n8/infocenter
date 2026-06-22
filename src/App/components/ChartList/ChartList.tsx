import type { ChartListType } from 'types/index';

import ChartCard from '../ChartCard/ChartCard';

import styles from './ChartList.module.scss';

function ChartList({ cards }: ChartListType) {
  return (
    <div className={styles.chartList}>
      {cards.map((card) => {
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
