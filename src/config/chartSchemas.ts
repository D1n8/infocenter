export type ChartFieldDef = { key: string; label: string; required?: boolean };

export const CHART_SCHEMAS: Record<string, ChartFieldDef[]> = {
  bar: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
  ],
  horizontal_bar: [
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'xAxis', label: 'Ось X', required: true },
  ],
  line: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
  ],
  pie: [
    { key: 'category', label: 'Категория', required: true },
    { key: 'value', label: 'Значение', required: true },
  ],
  polar: [
    { key: 'category', label: 'Ось', required: true },
    { key: 'value', label: 'Значение', required: true },
  ],
  scatter: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'name', label: 'Название', required: false },
  ],
  multi_line: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'splitBy', label: 'Разбивка', required: true },
  ],
  stacked_line: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'splitBy', label: 'Разбивка', required: true },
  ],
  stacked_bar: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'splitBy', label: 'Разбивка', required: true },
  ],
  radar: [
    { key: 'indicator', label: 'Оси радара', required: true },
    { key: 'value', label: 'Значение', required: true },
    { key: 'splitBy', label: 'Разбивка', required: true },
  ],
  funnel: [
    { key: 'category', label: 'Этап', required: true },
    { key: 'value', label: 'Значение', required: true },
  ],
  treemap: [
    { key: 'category', label: 'Блок', required: true },
    { key: 'value', label: 'Значение', required: true },
  ],
  gauge: [{ key: 'value', label: 'Показатель', required: true }],
  candlestick: [
    { key: 'xAxis', label: 'Временная ось', required: true },
    { key: 'open', label: 'Открытие', required: true },
    { key: 'close', label: 'Закрытие', required: true },
    { key: 'lowest', label: 'Минимум', required: true },
    { key: 'highest', label: 'Максимум', required: true },
  ],
  cumulative_plan_fact: [
    { key: 'xAxis', label: 'Временная ось (Дни/Даты)', required: true },
    { key: 'plan', label: 'План за день (Число)', required: true },
    { key: 'fact', label: 'Факт за день (Число)', required: true },
  ],
};

export const CHART_TYPE_OPTIONS = [
  { value: 'bar', label: 'Гистограмма' },
  { value: 'horizontal_bar', label: 'Горизонтальная гистограмма' },
  { value: 'line', label: 'Линейный график' },
  { value: 'pie', label: 'Круговая диаграмма' },
  { value: 'polar', label: 'Полярная диаграмма' },
  { value: 'scatter', label: 'Точечный график' },
  { value: 'multi_line', label: 'Несколько линий' },
  { value: 'stacked_line', label: 'Линии с накоплением' },
  { value: 'stacked_bar', label: 'Гистограмма с накоплением' },
  { value: 'radar', label: 'Радарная диаграмма' },
  { value: 'funnel', label: 'Воронка' },
  { value: 'treemap', label: 'Дерево' },
  { value: 'gauge', label: 'Датчик' },
  { value: 'candlestick', label: 'Японские свечи' },
  { value: 'cumulative_plan_fact', label: 'План-Факт (Нарастающим итогом)' },
];
