import type { BarSeriesOption, PieSeriesOption } from 'echarts';
import type { RowData, ChartConfig } from 'types/index';
import { describe, it, expect } from 'vitest';

import { transformDataForECharts } from './chartTransformer';

type ExpectedBarChart = {
  xAxis: { data: string[] };
  series: BarSeriesOption[];
};

type ExpectedPieChart = {
  series: PieSeriesOption[];
};

describe('transformDataForECharts', () => {
  const mockData: RowData[] = [
    { department: 'IT', salary: 2000 },
    { department: 'IT', salary: 3000 },
    { department: 'HR', salary: 1500 },
  ];

  it('возвращает пустой объект, если оси не выбраны', () => {
    const config: ChartConfig = {
      title: { text: 'Mock' },
      chartType: 'bar',
      mapping: { xAxis: '', yAxis: '' },
    };
    expect(transformDataForECharts(mockData, config)).toEqual({});
  });

  it('корректно трансформирует данные для гистограммы', () => {
    const config: ChartConfig = {
      title: { text: 'Mock' },
      chartType: 'bar',
      mapping: { xAxis: 'department', yAxis: 'salary' },
    };

    const result = transformDataForECharts(mockData, config) as unknown as ExpectedBarChart;

    expect(result.xAxis.data).toEqual(['IT', 'HR']);
    expect(result.series[0].data).toEqual([5000, 1500]);
  });

  it('корректно трансформирует данные для круговой диаграммы', () => {
    const config: ChartConfig = {
      title: { text: 'Mock' },
      chartType: 'pie',
      mapping: { category: 'department', value: 'salary' },
    };

    const result = transformDataForECharts(mockData, config) as unknown as ExpectedPieChart;

    expect(result.series[0].data).toEqual([
      { name: 'IT', value: 5000 },
      { name: 'HR', value: 1500 },
    ]);
  });

  it('игнорирует NaN', () => {
    const dataWithInvalid: RowData[] = [
      { department: 'IT', salary: 2000 },
      { department: 'IT', salary: 'invalid' },
    ];
    const config: ChartConfig = {
      title: { text: 'Mock' },
      chartType: 'bar',
      mapping: { xAxis: 'department', yAxis: 'salary' },
    };

    const result = transformDataForECharts(dataWithInvalid, config) as unknown as ExpectedBarChart;
    expect(result.series[0].data).toEqual([2000]);
  });
});
