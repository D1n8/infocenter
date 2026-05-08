import type { ChartConfig, RowData } from 'types/index';

export const mockData: RowData[] = [
  { department: 'IT', salary: 2000 },
  { department: 'IT', salary: 3000 },
  { department: 'HR', salary: 1500 },
];
export const config: ChartConfig = {
  title: { text: 'ПА выпуска продукта в цехе' },
  xAxis: 'department',
  yAxis: 'salary',
  chartType: 'bar',
};

export const mockCharts = [
  { id: 1, data: mockData, config },
  { id: 2, data: mockData, config },
  { id: 3, data: mockData, config },
  { id: 4, data: mockData, config },
  { id: 5, data: mockData, config },
  { id: 6, data: mockData, config },
];
