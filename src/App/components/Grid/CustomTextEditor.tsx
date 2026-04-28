import type { RenderEditCellProps } from 'react-data-grid';
import type { RowData } from 'types/index';

export function CustomTextEditor({ row, column, onRowChange }: RenderEditCellProps<RowData>) {
  return (
    <input
      autoFocus
      style={{ width: '100%', height: '100%', padding: '0 8px', boxSizing: 'border-box' }}
      value={String(row[column.key] ?? '')}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
    />
  );
}
