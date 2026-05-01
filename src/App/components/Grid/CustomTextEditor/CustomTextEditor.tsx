import type { RenderEditCellProps } from 'react-data-grid';
import type { RowData } from 'types/index';

import styles from './CustomTextEditor.module.scss';

function CustomTextEditor({ row, column, onRowChange }: RenderEditCellProps<RowData>) {
  return (
    <input
      autoFocus
      className={styles.textEditor}
      value={String(row[column.key] ?? '')}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
    />
  );
}

export default CustomTextEditor;
