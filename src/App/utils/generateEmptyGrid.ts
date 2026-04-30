import type { BaseColumn, RowData } from 'types/index';

export function generateEmptyGrid(colsCount: number, rowsCount: number) {
  const columns: BaseColumn[] = Array.from({ length: colsCount }, (_, i) => ({
    key: `col_${i + 1}`,
    name: `Колонка ${i + 1}`,
  }));

  const emptyRowTemplate: RowData = {};
  columns.forEach((col) => {
    emptyRowTemplate[col.key] = '';
  });

  const rows: RowData[] = Array.from({ length: rowsCount }, () => ({ ...emptyRowTemplate }));

  return { columns, rows };
}
