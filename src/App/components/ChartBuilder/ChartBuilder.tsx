import ReactECharts from 'echarts-for-react';
import React, { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
import type { RowData, ChartConfig, BaseColumn, CustomColumn } from 'types/index';
import { transformDataForECharts } from 'utils/chartTransformer';
import { parseClipboardData } from 'utils/clipboard';

import { CustomTextEditor } from '../Grid/CustomTextEditor';
import { DeleteRowCell } from '../Grid/DeleteRowCell';
import { EditableHeaderCell } from '../Grid/EditableHeaderCell';

import 'react-data-grid/lib/styles.css';
import './ChartBuilder.scss';

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
    <div>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <label>
          <b>Ось X: </b>
          <select
            value={chartConfig.xAxis}
            onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
          >
            <option value="">-- Выберите колонку --</option>
            {columns.map((col) => (
              <option key={col.key} value={col.key}>
                {col.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <b>Ось Y: </b>
          <select
            value={chartConfig.yAxis}
            onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
          >
            <option value="">-- Выберите колонку --</option>
            {columns.map((col) => (
              <option key={col.key} value={col.key}>
                {col.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <b>Тип графика: </b>
          <select
            value={chartConfig.chartType}
            onChange={(e) =>
              setChartConfig({ ...chartConfig, chartType: e.target.value as 'bar' | 'pie' })
            }
          >
            <option value="bar">Гистограмма (Bar)</option>
            <option value="pie">Круговая (Pie)</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={addRow} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          + Добавить строку
        </button>
        <button onClick={addColumn} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          + Добавить колонку
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '50%', outline: 'none' }} onPaste={handlePaste} tabIndex={0}>
          <DataGrid
            columns={gridColumns}
            rows={rows}
            onRowsChange={setRows}
            style={{ height: 400 }}
          />
        </div>

        <div style={{ width: '50%', border: '1px solid #ddd', borderRadius: '8px' }}>
          {chartConfig.xAxis && chartConfig.yAxis ? (
            <ReactECharts option={chartOption} style={{ height: '400px' }} />
          ) : (
            <div
              style={{ padding: '20px', textAlign: 'center', color: '#888', marginTop: '100px' }}
            >
              Выберите оси X и Y для построения графика
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChartBuilder;
