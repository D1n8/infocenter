import type { RenderCellProps } from 'react-data-grid';
import type { RowData, CustomColumn } from 'types/index';

import styles from './DeleteRowCell.module.scss';

function DeleteRowCell({ column, rowIdx }: RenderCellProps<RowData>) {
  const customColumn = column as CustomColumn;

  return (
    <button onClick={() => customColumn.onRemoveRow?.(rowIdx)} className={styles.deleteBtn}>
      ✕
    </button>
  );
}

export default DeleteRowCell;
