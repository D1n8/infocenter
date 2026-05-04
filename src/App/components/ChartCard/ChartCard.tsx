import { transformDataForECharts } from 'App/utils/chartTransformer';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import type { ChartConfig, RowData } from 'types/index';

import styles from './ChartCard.module.scss';

type ChartCard = {
  data: RowData[];
  config: ChartConfig;
};

function ChartCard({ data, config }: ChartCard) {
  const chartOption = useMemo(() => {
    return transformDataForECharts(data, config);
  }, []);

  return (
    <article className={styles.chartCard}>
      <MoreVertButton className={styles.moreVert} />
      <ReactECharts option={chartOption} />
    </article>
  );
}

export default ChartCard;
