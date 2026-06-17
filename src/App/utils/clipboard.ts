import type { RowData, BaseColumn } from 'types/index';

export function parseClipboardData(
  clipboardText: string
): { newColumns: BaseColumn[]; newRows: RowData[] } | null {
  const rawRows = clipboardText.split('\n');
  const matrix = rawRows
    .map((row) => row.split('\t'))
    .filter((row) => row.some((cell) => cell.trim() !== ''));

  if (matrix.length === 0) return null;

  const headers = matrix[0];
  const dataRows = matrix.slice(1);
  const timestamp = Date.now();

  const newColumns: BaseColumn[] = headers.map((headerText, index) => ({
    key: `col_${timestamp}_${index}`,
    name: headerText.trim() || `Колонка ${index + 1}`,
  }));

  const newRows: RowData[] = dataRows.map((rowArray) => {
    const rowObject: RowData = {};
    headers.forEach((_, colIndex) => {
      const cellValue = rowArray[colIndex] || '';
      rowObject[newColumns[colIndex].key] = cellValue.trim();
    });
    return rowObject;
  });

  return { newColumns, newRows };
}
