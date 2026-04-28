import type { RowData, ChartConfig } from 'types/index';

export function transformDataForECharts(data: RowData[], config: ChartConfig) {
  if (!config.xAxis || !config.yAxis) return {};

  const groupedData = data.reduce(
    (acc, row) => {
      const xValue = String(row[config.xAxis] || 'Неизвестно');
      const yValue = Number(row[config.yAxis]);

      if (!acc[xValue]) acc[xValue] = 0;
      if (!isNaN(yValue)) acc[xValue] += yValue;

      return acc;
    },
    {} as Record<string, number>
  );

  const categories = Object.keys(groupedData);
  const values = Object.values(groupedData);

  if (config.chartType === 'bar') {
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#5470c6' } }],
    };
  }

  if (config.chartType === 'pie') {
    const pieData = categories.map((cat) => ({
      name: cat,
      value: groupedData[cat],
    }));
    return {
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: '50%', data: pieData }],
    };
  }

  return {};
}
