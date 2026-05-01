import type { RenderHeaderCellProps } from 'react-data-grid';
import type { RowData, CustomColumn } from 'types/index';

import styles from './EditableHeaderCell.module.scss';

function EditableHeaderCell({ column }: RenderHeaderCellProps<RowData, unknown>) {
  const customColumn = column as CustomColumn;

  return (
    <div className={styles.headerCell}>
      <input
        value={customColumn.name as string}
        onChange={(e) => customColumn.onNameChange?.(customColumn.key, e.target.value)}
        className={styles.input}
      />
      <button
        onClick={() => customColumn.onRemoveColumn?.(customColumn.key)}
        className={styles.deleteBtn}
      >
        ✕
      </button>
    </div>
  );
}

export default EditableHeaderCell;
