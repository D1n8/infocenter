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
  | 'radar'
  | 'funnel'
  | 'treemap'
  | 'gauge'
  | 'candlestick'
  | 'cumulative_plan_fact';

export type UIConfig = {
  color?: string;
  colorPalette?: string[];
  isDonut?: boolean;
  showLegend?: boolean;
};

export type ChartConfig = {
  title: { text: string };
  chartType: ChartTypeAlias;
  mapping: Record<string, string>;
  uiConfig?: UIConfig;
};

export type BaseColumn = {
  key: string;
  name: string;
  type?: 'string' | 'number' | 'date';
};

export type CustomColumn = Column<RowData> & {
  onNameChange?: (key: string, newName: string) => void;
  onRemoveColumn?: (key: string) => void;
  onRemoveRow?: (rowIdx: number) => void;
};

export type CardType = {
  id: number;
  diagramId?: string;
  order?: number;
  data: RowData[];
  config: ChartConfig;
  isHidden?: boolean;
};

export type ChartListType = {
  cards: CardType[];
  setCards?: React.Dispatch<React.SetStateAction<CardType[]>>;
  isMaximize?: boolean;
  limit?: string;
};

export type SectionType = ChartListType & {
  setIsMaximize: (flag: boolean) => void;
  title?: string;
  onClick?: () => void;
};

export type LevelType = 'enterprise' | 'shop' | 'area';

export type BlockType = 'safety' | 'quality' | 'production' | 'economy' | 'culture';

export type ActionType = 'view' | 'manage' | 'manage_permissions';

export type PermissionType = {
  id: string;
  unit: {
    id: string;
    name: string;
    level_type: LevelType;
  };
  block: BlockType | 'all';
  action: ActionType;
};

export type UserPermissionsType = PermissionType[];

export type PermissionGrantType = {
  unit_id: string;
  block: BlockType | 'all';
  action: ActionType;
};

export type UserPermissionsRequestType = {
  permissions: PermissionGrantType[];
};

export type UnitTreeItem = {
  id: string;
  name: string;
  level: LevelType;
  children?: UnitTreeItem[];
};
