import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { transformDataForECharts } from 'App/utils/chartTransformer';
import classNames from 'classnames';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import type { ChartConfig, RowData } from 'types/index';

import styles from './ChartCard.module.scss';

type ChartCard = {
  data: RowData[];
  config: ChartConfig;
  id: number;
  isHidden?: boolean;
};

function ChartCard({ data, config, id, isHidden = false }: ChartCard) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const chartOption = useMemo(() => {
    return transformDataForECharts(data, config);
  }, [data, config]);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={classNames(styles.chartCard, { [styles.hidden]: isHidden })}
      {...attributes}
      {...listeners}
    >
      <MoreVertButton className={styles.moreVert} />
      <ReactECharts option={chartOption} />
    </article>
  );
}

export default ChartCard;
