import type { RowData, ChartConfig } from 'types/index';

export function transformDataForECharts(data: RowData[], config: ChartConfig) {
  if (!config.xAxis || !config.yAxis) return {};

  const groupedData = data.reduce<Record<string, number>>((acc, row) => {
    const xValue = String(row[config.xAxis] || 'Неизвестно');
    const yValue = Number(row[config.yAxis]);

    if (!isNaN(yValue)) {
      const currentSum = acc[xValue] ?? 0;

      acc[xValue] = currentSum + yValue;
    }

    return acc;
  }, {});

  const categories = Object.keys(groupedData);
  const values = Object.values(groupedData);

  if (config.chartType === 'bar') {
    return {
      title: { text: config.title.text, textStyle: { fontSize: 14, fontWeight: 400 } },
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
      title: { text: config.title.text, textStyle: { fontSize: 14, fontWeight: 400 } },
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: '50%', data: pieData }],
    };
  }

  return {};
}
