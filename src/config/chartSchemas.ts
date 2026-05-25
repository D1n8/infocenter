export type ChartFieldDef = { key: string; label: string; required?: boolean };

export const CHART_TYPE_OPTIONS = [
  { value: 'bar', label: 'Гистограмма (Bar)' },
  { value: 'horizontal_bar', label: 'Горизонтальная гистограмма' },
  { value: 'line', label: 'Линейный график (Line)' },
  { value: 'pie', label: 'Круговая диаграмма (Pie)' },
  { value: 'polar', label: 'Полярная диаграмма (Polar)' },
  { value: 'scatter', label: 'Точечный график (Scatter)' },
  { value: 'multi_line', label: 'Несколько линий (Multi-line)' },
  { value: 'stacked_line', label: 'Линии с накоплением (Area)' },
  { value: 'stacked_bar', label: 'Гистограмма с накоплением' },
  { value: 'radar', label: 'Радарная диаграмма (Radar)' },
];

export const CHART_SCHEMAS: Record<string, ChartFieldDef[]> = {
  bar: [
    { key: 'xAxis', label: 'Ось X (Категории)', required: true },
    { key: 'yAxis', label: 'Ось Y (Значения)', required: true },
  ],
  horizontal_bar: [
    { key: 'yAxis', label: 'Ось Y (Категории)', required: true },
    { key: 'xAxis', label: 'Ось X (Значения)', required: true },
  ],
  line: [
    { key: 'xAxis', label: 'Ось X (Время/Категории)', required: true },
    { key: 'yAxis', label: 'Ось Y (Значения)', required: true },
  ],
  pie: [
    { key: 'category', label: 'Сектор (Категория)', required: true },
    { key: 'value', label: 'Значение', required: true },
  ],
  polar: [
    { key: 'category', label: 'Ось (Угол/Категория)', required: true },
    { key: 'value', label: 'Значение (Радиус)', required: true },
  ],
  scatter: [
    { key: 'xAxis', label: 'Ось X (Число)', required: true },
    { key: 'yAxis', label: 'Ось Y (Число)', required: true },
    { key: 'name', label: 'Название точки', required: false },
  ],
  // ДВУМЕРНЫЕ ГРАФИКИ (ТРЕБУЮТ РАЗБИВКИ)
  multi_line: [
    { key: 'xAxis', label: 'Ось X (Время/Категории)', required: true },
    { key: 'yAxis', label: 'Ось Y (Значения)', required: true },
    { key: 'splitBy', label: 'Разбить на линии (Категория)', required: true },
  ],
  stacked_line: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'splitBy', label: 'Разбить на линии', required: true },
  ],
  stacked_bar: [
    { key: 'xAxis', label: 'Ось X', required: true },
    { key: 'yAxis', label: 'Ось Y', required: true },
    { key: 'splitBy', label: 'Разбить на сегменты', required: true },
  ],
  radar: [
    { key: 'indicator', label: 'Оси радара (Показатели)', required: true },
    { key: 'value', label: 'Значение', required: true },
    { key: 'splitBy', label: 'Разбить на полигоны (Объекты)', required: true },
  ],
};
