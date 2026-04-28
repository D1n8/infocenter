import type { RenderCellProps } from 'react-data-grid';
import type { RowData, CustomColumn } from 'types/index';

export function DeleteRowCell({ column, rowIdx }: RenderCellProps<RowData>) {
  const customColumn = column as CustomColumn;

  return (
    <button
      onClick={() => customColumn.onRemoveRow?.(rowIdx)}
      style={{
        cursor: 'pointer',
        background: '#ff4d4f',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px',
        width: '24px',
      }}
    >
      ✕
    </button>
  );
}
