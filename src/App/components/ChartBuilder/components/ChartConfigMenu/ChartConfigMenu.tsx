import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import { CHART_SCHEMAS, CHART_TYPE_OPTIONS } from 'config/chartSchemas';
import React from 'react';
import type { ChartConfig, BaseColumn } from 'types/index';

import styles from './ChartConfigMenu.module.scss';

type Props = {
  columns: BaseColumn[];
  chartConfig: ChartConfig;
  setChartConfig: React.Dispatch<React.SetStateAction<ChartConfig>>;
};

function ChartConfigMenu({ columns, chartConfig, setChartConfig }: Props) {
  const currentSchema = CHART_SCHEMAS[chartConfig.chartType] || [];

  const handleMappingChange = (key: string, value: string) => {
    setChartConfig((prev) => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [key]: value,
      },
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
      uiConfig: {
        ...prev.uiConfig,
        color,
      },
    }));
  };

  const columnOptions = columns.map((col) => ({
    value: col.key,
    label: col.name || 'Без названия',
  }));

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

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="chartColor">
            Цвет графика
          </label>
          <input
            type="color"
            id="chartColor"
            className={styles.colorPicker}
            value={chartConfig.uiConfig?.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
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
      </div>
    </div>
  );
}

export default ChartConfigMenu;
