import type { RenderHeaderCellProps } from 'react-data-grid';
import type { RowData, CustomColumn } from 'types/index';

export function EditableHeaderCell({ column }: RenderHeaderCellProps<RowData, unknown>) {
  const customColumn = column as CustomColumn;

  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '4px' }}>
      <input
        value={customColumn.name as string}
        onChange={(e) => customColumn.onNameChange?.(customColumn.key, e.target.value)}
        style={{
          flexGrow: 1,
          minWidth: 0,
          padding: '2px',
          fontSize: '14px',
          border: '1px solid transparent',
          borderRadius: '4px',
          backgroundColor: 'transparent',
        }}
      />
      <button
        onClick={() => customColumn.onRemoveColumn?.(customColumn.key)}
        style={{
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          color: '#ff4d4f',
          fontWeight: 'bold',
        }}
      >
        ✕
      </button>
    </div>
  );
}
