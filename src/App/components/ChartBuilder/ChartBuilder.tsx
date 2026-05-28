import Button from 'components/Button';
import { CHART_SCHEMAS } from 'config/chartSchemas';
import ReactECharts from 'echarts-for-react';
import { observer } from 'mobx-react-lite';
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import { useNavigate, useLocation } from 'react-router';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore'; // Импортируем хук
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { RowData, ChartConfig, BaseColumn, CustomColumn } from 'types/index';
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
  const { userStore } = useRootStore(); // Получаем правильный стор из контекста
  const [columns, setColumns] = useState<BaseColumn[]>((columns) => initialColumns);
  const [rows, setRows] = useState<RowData[]>((rows) => initialRows);

  const navigate = useNavigate();
  const location = useLocation();

  const stateContext = location.state as { block?: string; unitId?: string } | null;
  const currentBlock = stateContext?.block || 'production';
  const currentUnitId = stateContext?.unitId || '';

  useEffect(() => {
    if (userStore.user?.role === 'admin' && userStore.unitsTree.length === 0) {
      userStore.fetchUnitsTree();
    }
  }, [userStore]);

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

  const handleSave = async () => {
    if (columns.length === 0 || rows.length === 0) return;

    const findPermittedUnitId = () => {
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

    const columnsWithTypes = columns.map((col) => {
      const firstVal = rows[0]?.[col.key];
      let colType: 'string' | 'number' | 'date' = 'string';

      if (firstVal !== undefined && firstVal !== null && firstVal !== '') {
        const normalizedVal = String(firstVal).replace(',', '.').trim();
        if (!isNaN(Number(normalizedVal))) {
          colType = 'number';
        }
      }

      return {
        key: col.key,
        name: col.name || 'Без названия',
        type: colType,
      };
    });

    const diagram = await diagramStore.createDiagram({
      block: currentBlock as any,
      unit_id: targetUnitId,
      columns: columnsWithTypes,
      rows,
    });

    if (diagram) {
      await diagramStore.createChart({
        diagramId: diagram.id,
        title: chartConfig.title.text,
        chartType: chartConfig.chartType,
        mapping: chartConfig.mapping,
        uiConfig: {
          ...chartConfig.uiConfig,
          color: chartConfig.uiConfig?.color || SECTION_COLORS[currentBlock],
        },
      });
      navigate(-1);
    }
  };

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    title: { text: 'Новый график' },
    chartType: 'bar',
    mapping: {
      xAxis: initialColumns.length > 0 ? initialColumns[0].key : '',
      yAxis: initialColumns.length > 1 ? initialColumns[1].key : '',
    },
  });

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
    const configWithColor: ChartConfig = {
      ...chartConfig,
      uiConfig: {
        ...chartConfig.uiConfig,
        color: chartConfig.uiConfig?.color || SECTION_COLORS[currentBlock],
      },
    };
    return transformDataForECharts(rows, configWithColor);
  }, [rows, chartConfig, currentBlock]);

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

      <div className={layoutStyles.bottomContainer}>
        <div className={layoutStyles.btnContainer}>
          <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
            Отменить
          </Button>
          <Button onClick={handleSave} disabled={diagramStore.isLoading}>
            {diagramStore.isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ChartBuilder;
