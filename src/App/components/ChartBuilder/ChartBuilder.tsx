import SaveButtons from 'components/SaveButtons';
import { CHART_SCHEMAS } from 'config/chartSchemas';
import ReactECharts from 'echarts-for-react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import { useNavigate, useLocation } from 'react-router';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore';
import type { RowData, ChartConfig, BaseColumn, CustomColumn, BlockType } from 'types/index';
import { transformDataForECharts } from 'utils/chartTransformer';
import { parseClipboardData } from 'utils/clipboard';

import CustomTextEditor from '../Grid/CustomTextEditor';
import DeleteRowCell from '../Grid/DeleteRowCell';
import EditableHeaderCell from '../Grid/EditableHeaderCell';

import 'react-data-grid/lib/styles.css';
import styles from './ChartBuilder.module.scss';
import ChartConfigMenu from './components/ChartConfigMenu';

const SECTION_COLORS: Record<string, string> = {
  production: '#FADB14',
  economy: '#52C41A',
  safety: '#FF4D4F',
  quality: '#002766',
  culture: '#40A9FF',
};

type ChartBuilderProps = {
  initialColumns?: BaseColumn[];
  initialRows?: RowData[];
};

const ChartBuilder = observer(({ initialColumns = [], initialRows = [] }: ChartBuilderProps) => {
  const { userStore } = useRootStore();
  const [columns, setColumns] = useState<BaseColumn[]>(initialColumns);
  const [rows, setRows] = useState<RowData[]>(initialRows);

  const navigate = useNavigate();
  const location = useLocation();

  const stateContext = location.state as {
    block?: string;
    unitId?: string;
    isEditing?: boolean;
    chartId?: number;
    diagramId?: string;
  } | null;

  const currentBlock = (stateContext?.block as BlockType) || 'production';
  const currentUnitId = stateContext?.unitId || '';

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    title: { text: 'Новый график' },
    chartType: 'bar',
    mapping: {
      xAxis: initialColumns.length > 0 ? initialColumns[0].key : '',
      yAxis: initialColumns.length > 1 ? initialColumns[1].key : '',
    },
    uiConfig: {
      color: SECTION_COLORS[currentBlock],
    },
  });

  useEffect(() => {
    if (userStore.user?.role === 'admin' && userStore.unitsTree.length === 0) {
      userStore.fetchUnitsTree();
    }

    const loadEditData = async () => {
      if (stateContext?.isEditing && stateContext.diagramId && stateContext.chartId) {
        let rawDiagrams = toJS(diagramStore.diagrams);
        let rawCharts = toJS(diagramStore.charts);

        let diagram = rawDiagrams.find((d) => d.id === stateContext.diagramId);
        let chart = rawCharts.find((c) => c.id === stateContext.chartId);

        if (!diagram || !chart) {
          await Promise.all([
            diagramStore.fetchDiagramById(stateContext.diagramId),
            diagramStore.fetchCharts(stateContext.diagramId),
          ]);

          rawDiagrams = toJS(diagramStore.diagrams);
          rawCharts = toJS(diagramStore.charts);

          diagram = toJS(diagramStore.currentDiagram) || undefined;
          chart = rawCharts.find((c) => c.id === stateContext.chartId);
        }

        if (diagram && chart) {
          const restoredColumns: BaseColumn[] = diagram.columns.map((col, index) => ({
            key: col.key || `col_${index + 1}`,
            name: col.name,
            type: col.type,
          }));

          setColumns(restoredColumns);
          setRows(diagram.rows);
          setChartConfig({
            title: { text: chart.title },
            chartType: chart.chartType,
            mapping: chart.mapping,
            uiConfig: {
              ...chart.uiConfig,
              color: chart.uiConfig?.color || SECTION_COLORS[currentBlock],
            },
          });
        }
      }
    };

    loadEditData();
  }, [stateContext, userStore, currentBlock]);

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
    setColumns((prev) => [...prev, { key: newKey, name: '', type: 'string' }]);
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

  const handleSave = async () => {
    if (columns.length === 0 || rows.length === 0) {
      return;
    }

    const findPermittedUnitId = () => {
      if (stateContext?.isEditing && stateContext.diagramId) {
        const rawDiagrams = toJS(diagramStore.diagrams);
        const originalDiag = rawDiagrams.find((d) => d.id === stateContext.diagramId);
        if (originalDiag) {
          return originalDiag.unit_id;
        }
      }

      if (userStore.user?.role === 'admin') {
        return userStore.unitsTree[0]?.id || '';
      }
      const matchedPermission = userStore.myPermissions.find(
        (p) =>
          (p.block === currentBlock || p.block === 'all') &&
          (p.action === 'manage' || p.action === 'manage_permissions')
      );
      return matchedPermission?.unit.id || '';
    };

    const targetUnitId =
      currentUnitId && currentUnitId !== '00000000-0000-0000-0000-000000000000'
        ? currentUnitId
        : findPermittedUnitId();

    if (!targetUnitId) {
      return;
    }

    const columnsWithTypes = columns.map((col, index) => {
      const firstVal = rows[0]?.[col.key];
      let colType: 'string' | 'number' | 'date' = 'string';

      if (firstVal !== undefined && firstVal !== null && firstVal !== '') {
        const normalizedVal = String(firstVal).replace(',', '.').trim();
        if (!isNaN(Number(normalizedVal))) {
          colType = 'number';
        }
      }

      return {
        key: `col_${index + 1}`,
        name: col.name || 'Без названия',
        type: colType,
      };
    });

    const normalizedRows = rows.map((row) => {
      const rowObject: RowData = {};
      columns.forEach((col, index) => {
        rowObject[`col_${index + 1}`] = row[col.key] || '';
      });
      return rowObject;
    });

    const normalizedMapping: Record<string, string> = {};
    for (const mapKey in chartConfig.mapping) {
      const oldKey = chartConfig.mapping[mapKey];
      const colIndex = columns.findIndex((c) => c.key === oldKey);
      if (colIndex !== -1) {
        normalizedMapping[mapKey] = `col_${colIndex + 1}`;
      } else {
        normalizedMapping[mapKey] = '';
      }
    }

    const payloadDiagram = {
      block: currentBlock,
      unit_id: targetUnitId,
      columns: columnsWithTypes,
      rows: normalizedRows,
    };

    const payloadChart = {
      title: chartConfig.title.text,
      chartType: chartConfig.chartType,
      mapping: normalizedMapping,
      uiConfig: chartConfig.uiConfig,
    };

    if (stateContext?.isEditing && stateContext.diagramId && stateContext.chartId) {
      await diagramStore.updateDiagram(stateContext.diagramId, payloadDiagram);
      await diagramStore.updateChart(stateContext.chartId, payloadChart);
    } else {
      const diagram = await diagramStore.createDiagram(payloadDiagram);
      if (diagram) {
        await diagramStore.createChart({
          diagramId: diagram.id,
          ...payloadChart,
        });
      }
    }

    navigate(-1);
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
    const currentSchema = CHART_SCHEMAS[chartConfig.chartType];
    if (!currentSchema) return false;
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
          <ReactECharts option={chartOption} style={{ height: '100%' }} notMerge={true} />
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

      <SaveButtons handleSave={handleSave} isLoading={diagramStore.isLoading} />
    </div>
  );
});

export default ChartBuilder;
