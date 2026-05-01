import Button from 'components/Button';
import ReactECharts from 'echarts-for-react';
import React, { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
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

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    xAxis: initialColumns.length > 0 ? initialColumns[0].key : '',
    yAxis: initialColumns.length > 1 ? initialColumns[1].key : '',
    chartType: 'bar',
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
      xAxis: '',
      yAxis: '',
    }));
  };

  const updateColumnName = (key: string, newName: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, name: newName } : c)));
  };

  const removeColumn = (key: string) => {
    setColumns((prev) => prev.filter((c) => c.key !== key));
    setChartConfig((prev) => ({
      ...prev,
      xAxis: prev.xAxis === key ? '' : prev.xAxis,
      yAxis: prev.yAxis === key ? '' : prev.yAxis,
    }));
  };

  const addColumn = () => {
    const newKey = `col_${Date.now()}`;
    setColumns((prev) => [...prev, { key: newKey, name: 'Новая' }]);
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
      renderEditCell: CustomTextEditor,
      renderHeaderCell: EditableHeaderCell,
      onNameChange: updateColumnName,
      onRemoveColumn: removeColumn,
    })),
    {
      key: 'actions',
      name: '',
      width: 50,
      editable: false,
      renderCell: DeleteRowCell,
      onRemoveRow: removeRow,
    },
  ];

  const chartOption = useMemo(() => {
    return transformDataForECharts(rows, chartConfig);
  }, [rows, chartConfig]);

  return (
    <div className={styles.widget}>
      <ChartConfigMenu
        columns={columns}
        chartConfig={chartConfig}
        setChartConfig={setChartConfig}
      />
      <div className={styles.btnsContainer}>
        <Button onClick={addRow}>+ Добавить строку</Button>
        <Button onClick={addColumn}>+ Добавить колонку</Button>
      </div>

      <div className={styles.widgetContent}>
        <div className={styles.dataGridContainer} onPaste={handlePaste} tabIndex={0}>
          <DataGrid
            columns={gridColumns}
            rows={rows}
            onRowsChange={setRows}
            style={{ height: 400 }}
          />
        </div>

        <div className={styles.chartContainer}>
          {chartConfig.xAxis && chartConfig.yAxis ? (
            <ReactECharts option={chartOption} style={{ height: '100%' }} />
          ) : (
            <p className={styles.chartInfo}>Выберите оси X и Y для построения графика</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChartBuilder;
