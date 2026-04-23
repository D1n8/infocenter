import React, { useState, useMemo } from 'react';
import { type RenderEditCellProps, DataGrid } from 'react-data-grid';
import ReactECharts from 'echarts-for-react';
import 'react-data-grid/lib/styles.css';
import './Dashboard.scss';

type RowData = Record<string, any>;

interface ChartConfig {
  xAxis: string;
  yAxis: string;
  chartType: 'bar' | 'pie';
}

function CustomTextEditor({ row, column, onRowChange }: RenderEditCellProps<RowData>) {
  return (
    <input
      autoFocus
      style={{ width: '100%', height: '100%', padding: '0 8px', boxSizing: 'border-box' }}
      value={row[column.key]}
      onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
    />
  );
}

function EditableHeaderCell(props: any) {
  const { column } = props;
  const { onNameChange, onRemoveColumn } = column as any;

  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '4px' }}>
      <input
        value={column.name}
        onChange={(e) => onNameChange(column.key, e.target.value)}
        style={{ flexGrow: 1, minWidth: 0, padding: '2px', fontSize: '14px', border: '1px solid transparent', borderRadius: '4px', backgroundColor: 'transparent'}}
        title="Редактировать название"
      />
      <button 
        onClick={() => onRemoveColumn(column.key)}
        style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#ff4d4f', fontWeight: 'bold' }}
        title="Удалить колонку"
      >
        ✕
      </button>
    </div>
  );
}

function DeleteRowCell(props: any) {
  const { column, rowIdx } = props;
  const { onRemoveRow } = column as any;

  return (
    <button 
      onClick={() => onRemoveRow(rowIdx)}
    style={{ cursor: 'pointer', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', width: '24px' }}
    >
        х
    </button>
  );
}

function transformDataForECharts(data: RowData[], config: ChartConfig) {
  if (!config.xAxis || !config.yAxis) return {}; 

  const groupedData = data.reduce((acc, row) => {
    const xValue = String(row[config.xAxis] || 'Неизвестно'); 
    const yValue = Number(row[config.yAxis]);

    if (!acc[xValue]) acc[xValue] = 0;
    if (!isNaN(yValue)) acc[xValue] += yValue;

    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(groupedData);
  const values = Object.values(groupedData);

  if (config.chartType === 'bar') {
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#5470c6' } }]
    };
  }

  if (config.chartType === 'pie') {
    const pieData = categories.map(cat => ({
      name: cat,
      value: groupedData[cat]
    }));
    return {
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: '50%', data: pieData }]
    };
  }

  return {};
}

export default function DashboardExample() {
  const [columns, setColumns] = useState([
    { key: 'col1', name: 'Отдел', renderEditCell: CustomTextEditor },
    { key: 'col2', name: 'Проект', renderEditCell: CustomTextEditor },
    { key: 'col3', name: 'Бюджет', renderEditCell: CustomTextEditor },
  ]);

  const [rows, setRows] = useState<RowData[]>([
    { col1: 'IT', col2: 'Сайт', col3: 2000 },
    { col1: 'IT', col2: 'App', col3: 3000 },
    { col1: 'Marketing', col2: 'Реклама', col3: 1500 },
  ]);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    xAxis: 'col1', 
    yAxis: 'col3',
    chartType: 'bar'
  });

  const updateColumnName = (key: string, newName: string) => {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, name: newName } : c));
  };

  const removeColumn = (key: string) => {
    setColumns(prev => prev.filter(c => c.key !== key));
    setChartConfig(prev => ({
      ...prev,
      xAxis: prev.xAxis === key ? '' : prev.xAxis,
      yAxis: prev.yAxis === key ? '' : prev.yAxis,
    }));
  };

  const addColumn = () => {
    const newKey = `col_${Date.now()}`;
    setColumns(prev => [
      ...prev, 
      { key: newKey, name: 'Новая колонка', renderEditCell: CustomTextEditor }
    ]);
    setRows(prev => prev.map(r => ({ ...r, [newKey]: '' })));
  };

  const removeRow = (rowIdx: number) => {
    setRows(prev => prev.filter((_, idx) => idx !== rowIdx));
  };

  const addRow = () => {
    const newRow: RowData = {};
    columns.forEach(col => { newRow[col.key] = ''; });
    setRows(prev => [...prev, newRow]);
  };

  const gridColumns = [
    ...columns.map(col => ({
      ...col,
      renderHeaderCell: EditableHeaderCell,
      onNameChange: updateColumnName,
      onRemoveColumn: removeColumn
    })),
    {
      key: 'actions',
      name: "",
      width: 50,
      editable: false,
      renderCell: DeleteRowCell,
      onRemoveRow: removeRow
    }
  ];

  const chartOption = useMemo(() => {
    return transformDataForECharts(rows, chartConfig);
  }, [rows, chartConfig]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <label>
          <b>Ось X (Категории): </b>
          <select 
            value={chartConfig.xAxis} 
            onChange={(e) => setChartConfig({...chartConfig, xAxis: e.target.value})}
          >
            <option value="">-- Выберите колонку --</option>
            {columns.map(col => (
              <option key={col.key} value={col.key}>{col.name}</option>
            ))}
          </select>
        </label>

        <label>
          <b>Ось Y (Значения): </b>
          <select 
            value={chartConfig.yAxis} 
            onChange={(e) => setChartConfig({...chartConfig, yAxis: e.target.value})}
          >
            <option value="">-- Выберите колонку --</option>
            {columns.map(col => (
              <option key={col.key} value={col.key}>{col.name}</option>
            ))}
          </select>
        </label>

        <label>
          <b>Тип графика: </b>
          <select 
            value={chartConfig.chartType} 
            onChange={(e) => setChartConfig({...chartConfig, chartType: e.target.value as 'bar' | 'pie'})}
          >
            <option value="bar">Гистограмма (Bar)</option>
            <option value="pie">Круговая (Pie)</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={addRow} style={{ padding: '8px 12px', cursor: 'pointer' }}>+ Добавить строку</button>
        <button onClick={addColumn} style={{ padding: '8px 12px', cursor: 'pointer' }}>+ Добавить колонку</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        <div style={{ width: '50%' }}>
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
             <div style={{ padding: '20px', textAlign: 'center', color: '#888', marginTop: '100px' }}>
               Выберите оси X и Y для построения графика
             </div>
          )}
        </div>

      </div>
    </div>
  );
}