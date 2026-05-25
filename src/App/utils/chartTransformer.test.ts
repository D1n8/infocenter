import type { RowData, ChartConfig } from 'types/index';
import { describe, it, expect } from 'vitest';

import { transformDataForECharts } from './chartTransformer';

describe('transformDataForECharts', () => {
  const mockData: RowData[] = [
    { department: 'IT', salary: 2000 },
    { department: 'IT', salary: 3000 },
    { department: 'HR', salary: 1500 },
  ];

  it('возвращает пустой объект, если оси не выбраны', () => {
    const config: ChartConfig = {
      title: { text: 'Mock chart' },
      chartType: 'bar',
      mapping: {
        xAxis: '',
        yAxis: '',
      },
    };
    const result = transformDataForECharts(mockData, config);
    expect(result).toEqual({});
  });

  it('корректно трансформируются данные для гистограммы', () => {
    const config: ChartConfig = {
      title: { text: 'Mock chart' },
      chartType: 'bar',
      mapping: {
        xAxis: 'department',
        yAxis: 'salary',
      },
    };
    const result = transformDataForECharts(mockData, config);

    if (!('series' in result) || !result.series) {
      throw new Error('Ожидалось, что график будет сформирован');
    }

    expect(result.xAxis).toEqual({ type: 'category', data: ['IT', 'HR'] });
    expect(result.series[0].data).toEqual([5000, 1500]);
  });

  it('корректно трансформируются данные для круговой диаграммы', () => {
    const config: ChartConfig = {
      title: { text: 'Mock chart' },
      chartType: 'pie',
      mapping: {
        category: 'department',
        value: 'salary',
      },
    };
    const result = transformDataForECharts(mockData, config);

    if (!('series' in result) || !result.series) {
      throw new Error('Ожидалось, что график будет сформирован');
    }

    expect(result.series[0].data).toEqual([
      { name: 'IT', value: 5000 },
      { name: 'HR', value: 1500 },
    ]);
  });

  it('при трансформации игнорируются NaN', () => {
    const dataWithInvalid: RowData[] = [
      { department: 'IT', salary: 2000 },
      { department: 'IT', salary: 'invalid_string' },
    ];
    const config: ChartConfig = {
      title: { text: 'Mock chart' },
      chartType: 'bar',
      mapping: {
        xAxis: 'department',
        yAxis: 'salary',
      },
    };
    const result = transformDataForECharts(dataWithInvalid, config);

    if (!('series' in result) || !result.series) {
      throw new Error('Ожидалось, что график будет сформирован');
    }

    expect(result.series[0].data).toEqual([2000]);
  });
});
