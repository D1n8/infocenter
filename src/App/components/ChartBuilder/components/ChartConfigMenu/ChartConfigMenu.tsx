import Dropdown, { type DropdownOption } from 'components/Dropdown/Dropdown';
import Input from 'components/Input';
import { CHART_SCHEMAS, CHART_TYPE_OPTIONS } from 'config/chartSchemas';
import React from 'react';
import type { ChartConfig, BaseColumn, ChartRule } from 'types/index';

import styles from './ChartConfigMenu.module.scss';

type Props = {
  columns: BaseColumn[];
  chartConfig: ChartConfig;
  setChartConfig: React.Dispatch<React.SetStateAction<ChartConfig>>;
};

const OPERATOR_OPTIONS: DropdownOption[] = [
  { value: '>', label: '> (Больше)' },
  { value: '<', label: '< (Меньше)' },
  { value: '>=', label: '≥ (Больше или равно)' },
  { value: '<=', label: '≤ (Меньше или равно)' },
  { value: '==', label: '= (Равно)' },
  { value: '!=', label: '≠ (Не равно)' },
];

function ChartConfigMenu({ columns, chartConfig, setChartConfig }: Props) {
  const currentSchema = CHART_SCHEMAS[chartConfig.chartType] || [];

  const handleMappingChange = (key: string, value: string) => {
    setChartConfig((prev) => ({
      ...prev,
      mapping: { ...prev.mapping, [key]: value },
    }));
  };

  const handleTypeChange = (newType: string) => {
    setChartConfig((prev) => ({
      ...prev,
      chartType: newType as ChartConfig['chartType'],
      mapping: {},
    }));
  };

  const handleColorChange = (color: string) => {
    setChartConfig((prev) => ({
      ...prev,
      uiConfig: { ...prev.uiConfig, color },
    }));
  };

  const handleAddRule = () => {
    setChartConfig((prev) => ({
      ...prev,
      uiConfig: {
        ...prev.uiConfig,
        rules: [...(prev.uiConfig?.rules || []), { operator: '>', value: 0, color: '#ff4d4f' }],
      },
    }));
  };

  const handleUpdateRule = (index: number, key: keyof ChartRule, value: string | number) => {
    setChartConfig((prev) => {
      const newRules = [...(prev.uiConfig?.rules || [])];
      newRules[index] = { ...newRules[index], [key]: value };
      return { ...prev, uiConfig: { ...prev.uiConfig, rules: newRules } };
    });
  };

  const handleRemoveRule = (index: number) => {
    setChartConfig((prev) => {
      const newRules = [...(prev.uiConfig?.rules || [])];
      newRules.splice(index, 1);
      return { ...prev, uiConfig: { ...prev.uiConfig, rules: newRules } };
    });
  };

  const columnOptions = columns.map((col) => ({
    value: col.key,
    label: col.name || 'Без названия',
  }));

  const type = chartConfig.chartType;
  const canChangeColor = type !== 'cumulative_plan_fact';
  const canHaveRules = type !== 'radar' && type !== 'gauge' && type !== 'cumulative_plan_fact';

  return (
    <div className={styles.menu}>
      <div className={styles.menuContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="title">
            Название графика
          </label>
          <Input
            id="title"
            className={styles.input}
            value={chartConfig.title.text}
            onChange={(e) =>
              setChartConfig((prev) => ({
                ...prev,
                title: { text: String(e.target.value ?? '') },
              }))
            }
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="chartType">
            Тип
          </label>
          <Dropdown
            id="chartType"
            options={CHART_TYPE_OPTIONS}
            value={chartConfig.chartType}
            onChange={(opt) => handleTypeChange(String(opt.value))}
            placeholder="Выберите тип графика"
          />
        </div>

        <div className={styles.dynamicFields}>
          {currentSchema.map((field) => (
            <div key={field.key} className={styles.inputContainer}>
              <label className={styles.label} htmlFor={`field-${field.key}`}>
                {field.label}
              </label>
              <Dropdown
                id={`field-${field.key}`}
                options={columnOptions}
                value={chartConfig.mapping[field.key] || null}
                onChange={(opt) => handleMappingChange(field.key, String(opt.value))}
                placeholder="-- Выберите колонку --"
              />
            </div>
          ))}
        </div>

        {canChangeColor && (
          <div className={styles.inputContainer}>
            <label className={styles.label}>Базовый цвет графика</label>
            <input
              type="color"
              value={chartConfig.uiConfig?.color || '#1890ff'}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0',
                cursor: 'pointer',
                border: 'none',
              }}
            />
          </div>
        )}

        {canHaveRules && (
          <div className={styles.rulesSection}>
            <label className={styles.label}>Условное форматирование</label>

            {chartConfig.uiConfig?.rules?.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                <Dropdown
                  id={`rule-operator-${idx}`}
                  options={OPERATOR_OPTIONS}
                  value={rule.operator}
                  onChange={(opt) => handleUpdateRule(idx, 'operator', String(opt.value))}
                  placeholder="Оператор"
                />

                <Input
                  type="number"
                  value={rule.value}
                  onChange={(e) => handleUpdateRule(idx, 'value', Number(e.target.value))}
                  style={{
                    width: '80px',
                    paddingBlock: '8px',
                  }}
                />

                <Input
                  type="color"
                  value={rule.color}
                  onChange={(e) => handleUpdateRule(idx, 'color', e.target.value)}
                  style={{
                    width: '40px',
                    height: '43px',
                    padding: '0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                />

                <button
                  onClick={() => handleRemoveRule(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4f',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={handleAddRule}
              style={{
                background: '#f5f5f5',
                border: '1px dashed #d9d9d9',
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#595959',
                marginTop: '4px',
              }}
            >
              + Добавить правило
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartConfigMenu;
