import type {
  EChartsOption,
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
} from 'echarts';
import type { RowData, ChartConfig } from 'types/index';

export function transformDataForECharts(data: RowData[], config: ChartConfig): EChartsOption {
  const { chartType, mapping, title } = config;

  const baseOption: EChartsOption = {
    title: { text: title.text, textStyle: { fontSize: 14, fontWeight: 400 } },
    tooltip: { trigger: 'axis' },
  };

  // 1. Scatter (Без группировки)
  if (chartType === 'scatter') {
    if (!mapping.xAxis || !mapping.yAxis) return {};
    const scatterData: (string | number)[][] = data
      .map((row) => {
        const x = Number(row[mapping.xAxis]);
        const y = Number(row[mapping.yAxis]);
        const name = mapping.name ? String(row[mapping.name]) : '';
        return !isNaN(x) && !isNaN(y) ? [x, y, name] : null;
      })
      .filter((item): item is [number, number, string] => item !== null);

    return {
      ...baseOption,
      tooltip: { trigger: 'item' },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [{ type: 'scatter', data: scatterData } as ScatterSeriesOption],
    };
  }

  // 2. Простая группировка
  const simple1DCharts = ['bar', 'horizontal_bar', 'line', 'pie', 'polar'];
  if (simple1DCharts.includes(chartType)) {
    const isPieOrPolar = chartType === 'pie' || chartType === 'polar';
    const isHBar = chartType === 'horizontal_bar';
    const xKey = isPieOrPolar ? mapping.category : isHBar ? mapping.yAxis : mapping.xAxis;
    const yKey = isPieOrPolar ? mapping.value : isHBar ? mapping.xAxis : mapping.yAxis;

    if (!xKey || !yKey) return {};

    const grouped = data.reduce<Record<string, number>>((acc, row) => {
      const xVal = String(row[xKey] || 'Неизвестно');
      const yVal = Number(row[yKey]);
      if (!isNaN(yVal)) acc[xVal] = (acc[xVal] ?? 0) + yVal;
      return acc;
    }, {});

    const categories = Object.keys(grouped);
    const values = Object.values(grouped);

    if (chartType === 'bar' || chartType === 'horizontal_bar') {
      return {
        ...baseOption,
        xAxis: isHBar ? { type: 'value' } : { type: 'category', data: categories },
        yAxis: isHBar ? { type: 'category', data: categories } : { type: 'value' },
        series: [{ type: 'bar', data: values } as BarSeriesOption],
      };
    }
    if (chartType === 'line') {
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: values } as LineSeriesOption],
      };
    }
    if (chartType === 'pie') {
      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: categories.map((cat) => ({ name: cat, value: grouped[cat] })),
          } as PieSeriesOption,
        ],
      };
    }
    if (chartType === 'polar') {
      return {
        ...baseOption,
        polar: { radius: [30, '80%'] },
        angleAxis: { type: 'category', data: categories },
        radiusAxis: { max: 'dataMax' },
        series: [{ type: 'bar', data: values, coordinateSystem: 'polar' } as BarSeriesOption],
      };
    }
  }

  // 3. Двумерная группировка
  const multiSeriesCharts = ['multi_line', 'stacked_line', 'stacked_bar', 'radar'];
  if (multiSeriesCharts.includes(chartType)) {
    const xKey = chartType === 'radar' ? mapping.indicator : mapping.xAxis;
    const yKey = mapping.yAxis || mapping.value;
    const splitKey = mapping.splitBy;

    if (!xKey || !yKey || !splitKey) return {};

    const xCategoriesSet = new Set<string>();
    const splitCategoriesSet = new Set<string>();
    const pivotData: Record<string, Record<string, number>> = {};

    data.forEach((row) => {
      const xVal = String(row[xKey] || 'Неизвестно');
      const yVal = Number(row[yKey]);
      const splitVal = String(row[splitKey] || 'Неизвестно');
      if (!isNaN(yVal)) {
        xCategoriesSet.add(xVal);
        splitCategoriesSet.add(splitVal);
        if (!pivotData[splitVal]) pivotData[splitVal] = {};
        pivotData[splitVal][xVal] = (pivotData[splitVal][xVal] ?? 0) + yVal;
      }
    });

    const xCategories = Array.from(xCategoriesSet);
    const splitCategories = Array.from(splitCategoriesSet);

    if (chartType === 'radar') {
      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        legend: { data: splitCategories, bottom: 0 },
        radar: { indicator: xCategories.map((name) => ({ name })) },
        series: [
          {
            type: 'radar',
            data: splitCategories.map((s) => ({
              name: s,
              value: xCategories.map((x) => pivotData[s][x] || 0),
            })),
          } as RadarSeriesOption,
        ],
      };
    }

    const isStacked = chartType === 'stacked_bar' || chartType === 'stacked_line';
    const seriesType = chartType === 'stacked_bar' ? 'bar' : 'line';

    const series = splitCategories.map((s): BarSeriesOption | LineSeriesOption => ({
      name: s,
      type: seriesType as 'bar' | 'line',
      stack: isStacked ? 'total' : undefined,
      areaStyle: chartType === 'stacked_line' ? {} : undefined,
      data: xCategories.map((x) => pivotData[s][x] || 0),
    }));

    return {
      ...baseOption,
      legend: { data: splitCategories, bottom: 0 },
      xAxis: { type: 'category', data: xCategories },
      yAxis: { type: 'value' },
      series: series as (BarSeriesOption | LineSeriesOption)[],
    };
  }

  return {};
}
