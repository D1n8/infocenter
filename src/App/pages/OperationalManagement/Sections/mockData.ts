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
