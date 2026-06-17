import type { BaseColumn, BlockType, ChartTypeAlias, RowData, UIConfig } from 'types/index';

export type DatasetResponse = {
  id: string;
  block: BlockType | 'all';
  unit_id: string;
  columns: BaseColumn[];
  rows: RowData[];
  created_by: string;
  created_at: string;
  updated_at: string;
  order?: number;
};

export type DatasetCreate = {
  block: BlockType | 'all';
  unit_id: string;
  columns: BaseColumn[];
  rows: RowData[];
  order?: number;
};

export type ChartResponse = {
  id: number;
  diagramId: string;
  title: string;
  chartType: ChartTypeAlias;
  mapping: Record<string, string>;
  uiConfig?: UIConfig;
};

export type ChartCreate = {
  diagramId: string;
  title: string;
  chartType: ChartTypeAlias;
  mapping: Record<string, string>;
  uiConfig?: UIConfig;
};
