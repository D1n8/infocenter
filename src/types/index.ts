import type { Column } from 'react-data-grid';

export type RowData = Record<string, string | number>;

export type ChartTypeAlias =
  | 'bar'
  | 'horizontal_bar'
  | 'line'
  | 'pie'
  | 'polar'
  | 'scatter'
  | 'multi_line'
  | 'stacked_line'
  | 'stacked_bar'
  | 'radar';

export type ChartConfig = {
  title: { text: string };
  chartType: ChartTypeAlias;
  mapping: Record<string, string>;
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

export type CardType = {
  id: number;
  data: RowData[];
  config: ChartConfig;
};

export type ChartListType = {
  cards: CardType[];
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
  isMaximize?: boolean;
};

export type SectionType = ChartListType & {
  setIsMaximize: (flag: boolean) => void;
  title?: string;
  onClick?: () => void;
};
