import type { Column } from 'react-data-grid';

export type RowData = Record<string, string | number>;

export type ChartConfig = {
  xAxis: string;
  yAxis: string;
  chartType: 'bar' | 'pie';
};

export type BaseColumn = {
  key: string;
  name: string;
};

export type CustomColumn = Column<RowData> & {
  onNameChange?: (key: string, newName: string) => void;
  onRemoveColumn?: (key: string) => void;
  onRemoveRow?: (rowIdx: number) => void;
};
