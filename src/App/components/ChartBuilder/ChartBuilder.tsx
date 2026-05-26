import Button from 'components/Button';
import { CHART_SCHEMAS } from 'config/chartSchemas';
import ReactECharts from 'echarts-for-react';
import React, { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
import { useNavigate } from 'react-router';
import type { RowData, ChartConfig, BaseColumn, CustomColumn } from 'types/index';
import { transformDataForECharts } from 'utils/chartTransformer';
import { parseClipboardData } from 'utils/clipboard';

import CustomTextEditor from '../Grid/CustomTextEditor';
import DeleteRowCell from '../Grid/DeleteRowCell';
import EditableHeaderCell from '../Grid/EditableHeaderCell';

import 'react-data-grid/lib/styles.css';
import styles from './ChartBuilder.module.scss';
import ChartConfigMenu from './components/ChartConfigMenu';

type ChartBuilderProps = {
  initialColumns?: BaseColumn[];
  initialRows?: RowData[];
};

function ChartBuilder({ initialColumns = [], initialRows = [] }: ChartBuilderProps) {
  const [columns, setColumns] = useState<BaseColumn[]>(initialColumns);
  const [rows, setRows] = useState<RowData[]>(initialRows);

  const navigate = useNavigate();

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    title: { text: 'Новый график' },
    chartType: 'bar',
    mapping: {
      xAxis: initialColumns.length > 0 ? initialColumns[0].key : '',
      yAxis: initialColumns.length > 1 ? initialColumns[1].key : '',
    },
  });

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData.getData('Text');
    if (!clipboardData) return;

    e.preventDefault();

    const parsed = parseClipboardData(clipboardData);
    if (!parsed) return;

    setColumns(parsed.newColumns);
    setRows(parsed.newRows);

    setChartConfig((prev) => ({
      ...prev,
      mapping: {},
    }));
  };

  const updateColumnName = (key: string, newName: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, name: newName } : c)));
  };

  const removeColumn = (key: string) => {
    setColumns((prev) => prev.filter((c) => c.key !== key));

    setChartConfig((prev) => {
      const newMapping = { ...prev.mapping };
      for (const mapKey in newMapping) {
        if (newMapping[mapKey] === key) {
          newMapping[mapKey] = '';
        }
      }
      return { ...prev, mapping: newMapping };
    });
  };

  const addColumn = () => {
    const newKey = `col_${Date.now()}`;
    setColumns((prev) => [...prev, { key: newKey, name: '' }]);
    setRows((prev) => prev.map((r) => ({ ...r, [newKey]: '' })));
  };

  const removeRow = (rowIdx: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  const addRow = () => {
    const newRow: RowData = {};
    columns.forEach((col) => {
      newRow[col.key] = '';
    });
    setRows((prev) => [...prev, newRow]);
  };

  const gridColumns: CustomColumn[] = [
    ...columns.map((col) => ({
      ...col,
      resizable: true,
      minWidth: 100,
      renderEditCell: CustomTextEditor,
      renderHeaderCell: EditableHeaderCell,
      onNameChange: updateColumnName,
      onRemoveColumn: removeColumn,
    })),
    {
      key: 'actions',
      name: '',
      width: 50,
      resizable: false,
      editable: false,
      renderCell: DeleteRowCell,
      onRemoveRow: removeRow,
    },
  ];

  const chartOption = useMemo(() => {
    return transformDataForECharts(rows, chartConfig);
  }, [rows, chartConfig]);

  const isChartReady = useMemo(() => {
    const currentSchema = CHART_SCHEMAS[chartConfig.chartType] || [];
    return currentSchema
      .filter((field) => field.required)
      .every((field) => chartConfig.mapping[field.key]);
  }, [chartConfig]);

  return (
    <div className={styles.widget}>
      <ChartConfigMenu
        columns={columns}
        chartConfig={chartConfig}
        setChartConfig={setChartConfig}
      />

      <div className={styles.chartContainer}>
        {isChartReady ? (
          <ReactECharts option={chartOption} style={{ height: '100%' }} />
        ) : (
          <p className={styles.chartInfo}>Выберите все обязательные оси для построения графика</p>
        )}
      </div>

      <div className={styles.dataGridSection} onPaste={handlePaste} tabIndex={0}>
        <div className={styles.tableAndColBtnWrapper}>
          <div className={styles.gridContainer}>
            <DataGrid
              columns={gridColumns}
              rows={rows}
              onRowsChange={setRows}
              className={styles.grid}
            />
          </div>

          <button className={styles.addBtn} onClick={addColumn} title="Добавить колонку">
            +
          </button>
        </div>

        <button className={styles.addBtn} onClick={addRow} title="Добавить строку">
          +
        </button>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.btnContainer}>
          <Button className={styles.cancelBtn} onClick={() => navigate(-1)}>
            Отменить
          </Button>
          <Button>Сохранить</Button>
        </div>
      </div>
    </div>
  );
}

export default ChartBuilder;
