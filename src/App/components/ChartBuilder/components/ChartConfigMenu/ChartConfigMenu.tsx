import type { BaseColumn, ChartConfig } from 'types/index';

import styles from './ChartConfigMenu.module.scss';

type ChartConfigMenu = {
  columns: BaseColumn[];
  chartConfig: ChartConfig;
  setChartConfig: (chartConfig: ChartConfig) => void;
};

function ChartConfigMenu({ columns, chartConfig, setChartConfig }: ChartConfigMenu) {
  return (
    <div className={styles.menu}>
      <label>
        <b>Ось X: </b>
        <select
          value={chartConfig.xAxis}
          onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
        >
          <option value="">-- Выберите колонку --</option>
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <b>Ось Y: </b>
        <select
          value={chartConfig.yAxis}
          onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
        >
          <option value="">-- Выберите колонку --</option>
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <b>Тип графика: </b>
        <select
          value={chartConfig.chartType}
          onChange={(e) =>
            setChartConfig({ ...chartConfig, chartType: e.target.value as 'bar' | 'pie' })
          }
        >
          <option value="bar">Гистограмма (Bar)</option>
          <option value="pie">Круговая (Pie)</option>
        </select>
      </label>
    </div>
  );
}

export default ChartConfigMenu;
