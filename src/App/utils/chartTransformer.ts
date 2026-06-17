import type {
  EChartsOption,
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
  GaugeSeriesOption,
  CandlestickSeriesOption,
  FunnelSeriesOption,
  TreemapSeriesOption,
} from 'echarts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import type { RowData, ChartConfig, ChartRule } from 'types/index';

type StyledDataPoint = number | { value: number; itemStyle: { color: string } };

type TooltipParam = {
  seriesName: string;
  value: number;
  axisValue: string;
};

export function transformDataForECharts(data: RowData[], config: ChartConfig): EChartsOption {
  const { chartType, mapping, title, uiConfig } = config;

  const baseOption: EChartsOption = {
    title: { text: title.text, textStyle: { fontSize: 14, fontWeight: 400 } },
    tooltip: { trigger: 'axis' },
    color: uiConfig?.colorPalette || (uiConfig?.color ? [uiConfig.color] : undefined),
  };

  if (chartType === 'scatter') {
    if (!mapping.xAxis || !mapping.yAxis) return {};

    // Типизируем массив данных как возможные объекты или вложенные массивы
    const scatterData = data
      .map((row) => {
        const x = Number(row[mapping.xAxis]);
        const y = Number(row[mapping.yAxis]);
        const name = mapping.name ? String(row[mapping.name]) : '';

        if (isNaN(x) || isNaN(y)) return null;

        const processedY = applyRules(y, config.uiConfig?.rules);

        if (typeof processedY === 'object') {
          return {
            value: [x, y, name],
            itemStyle: processedY.itemStyle,
          };
        }

        return [x, y, name];
      })
      .filter((item) => item !== null);

    return {
      ...baseOption,
      tooltip: {
        trigger: 'item',
        // Строго типизируем коллбэк для всплывающей подсказки
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          // У scatter всегда trigger: 'item', значит params - это не массив
          const p = Array.isArray(params) ? params[0] : params;

          // ECharts сам извлекает [x, y, name] в p.value
          const val = p.value as [number, number, string];
          const x = val[0];
          const y = val[1];
          const pointName = val[2];

          const nameHtml = pointName ? `<b>${pointName}</b><br/>` : '';
          return `${nameHtml}X: ${x}<br/>Y: ${y}`;
        },
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'scatter',
          data: scatterData as ScatterSeriesOption['data'], // Используем встроенный тип ECharts
          itemStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
          label: {
            show: !!mapping.name,
            formatter: (params: CallbackDataParams) => {
              const val = params.value as [number, number, string];
              return val[2] || '';
            },
            position: 'right',
          },
        },
      ],
    };
  }

  if (chartType === 'gauge') {
    const valueKey = mapping.value;
    if (!valueKey) return {};

    const totalValue = data.reduce((sum, row) => {
      const val = Number(row[valueKey]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    return {
      ...baseOption,
      tooltip: { formatter: '{b} : {c}' },
      series: [
        {
          type: 'gauge',
          progress: { show: true },
          detail: { valueAnimation: true, formatter: '{value}' },
          itemStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
          data: [{ value: Number(totalValue.toFixed(1)), name: title.text }],
        } as GaugeSeriesOption,
      ],
    };
  }

  if (chartType === 'cumulative_plan_fact') {
    const { xAxis, plan, fact } = mapping;
    if (!xAxis || !plan || !fact) return {};

    const categories: string[] = [];
    const planCumulative: number[] = [];
    const factCumulative: number[] = [];

    const baseArea: number[] = [];
    const behindArea: number[] = [];
    const aheadArea: number[] = [];

    let currentPlanSum = 0;
    let currentFactSum = 0;

    data.forEach((row) => {
      const dayLabel = String(row[xAxis] || 'Неизвестно');
      const dailyPlan = Number(row[plan]);
      const dailyFact = Number(row[fact]);

      if (!isNaN(dailyPlan) && !isNaN(dailyFact)) {
        currentPlanSum += dailyPlan;
        currentFactSum += dailyFact;

        categories.push(dayLabel);
        planCumulative.push(currentPlanSum);
        factCumulative.push(currentFactSum);

        const minVal = Math.min(currentPlanSum, currentFactSum);
        const behind = Math.max(0, currentPlanSum - currentFactSum);
        const ahead = Math.max(0, currentFactSum - currentPlanSum);

        baseArea.push(minVal);
        behindArea.push(behind);
        aheadArea.push(ahead);
      }
    });

    return {
      ...baseOption,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const list = params as unknown as TooltipParam[];
          const day = list[0]?.axisValue || '';
          const planItem = list.find((item) => item.seriesName === 'План (накоп.)');
          const factItem = list.find((item) => item.seriesName === 'Факт (накоп.)');

          return `
            <b>День ${day}</b><br/>
            План (накоп.): ${planItem?.value ?? 0}<br/>
            Факт (накоп.): ${factItem?.value ?? 0}
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        boundaryGap: false,
        splitLine: { show: true, lineStyle: { color: '#e0e0e0' } },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: true, lineStyle: { color: '#e0e0e0' } },
      },
      series: [
        {
          name: 'Base',
          type: 'line',
          data: baseArea,
          stack: 'total',
          symbol: 'none',
          lineStyle: { opacity: 0 },
          areaStyle: { opacity: 0 },
        } as LineSeriesOption,
        {
          name: 'Behind',
          type: 'line',
          data: behindArea,
          stack: 'total',
          symbol: 'none',
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(255, 77, 79, 0.3)' },
        } as LineSeriesOption,
        {
          name: 'Ahead',
          type: 'line',
          data: aheadArea,
          stack: 'total',
          symbol: 'none',
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(82, 196, 26, 0.3)' },
        } as LineSeriesOption,
        {
          name: 'План (накоп.)',
          type: 'line',
          data: planCumulative,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#000000', width: 2 },
          itemStyle: { color: '#000000' },
        } as LineSeriesOption,
        {
          name: 'Факт (накоп.)',
          type: 'line',
          data: factCumulative,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: '#1890ff', width: 3 },
          itemStyle: { color: '#1890ff' },
        } as LineSeriesOption,
      ],
    };
  }

  const simple1DCharts = ['bar', 'horizontal_bar', 'line', 'pie', 'polar', 'funnel', 'treemap'];

  if (simple1DCharts.includes(chartType)) {
    const isCategoryBased = ['pie', 'polar', 'funnel', 'treemap'].includes(chartType);
    const isHBar = chartType === 'horizontal_bar';

    const xKey = isCategoryBased ? mapping.category : isHBar ? mapping.yAxis : mapping.xAxis;
    const yKey = isCategoryBased ? mapping.value : isHBar ? mapping.xAxis : mapping.yAxis;

    if (!xKey || !yKey) return {};

    const grouped = data.reduce<Record<string, number>>((acc, row) => {
      const xVal = String(row[xKey] || 'Неизвестно');
      const yVal = Number(row[yKey]);
      if (!isNaN(yVal)) acc[xVal] = (acc[xVal] ?? 0) + yVal;
      return acc;
    }, {});

    const categories = Object.keys(grouped);
    const values = Object.values(grouped);

    const dataWithRules = values.map((v) => applyRules(v, config.uiConfig?.rules));

    if (chartType === 'bar' || chartType === 'horizontal_bar') {
      return {
        ...baseOption,
        xAxis: isHBar ? { type: 'value' } : { type: 'category', data: categories },
        yAxis: isHBar ? { type: 'category', data: categories } : { type: 'value' },
        series: [
          {
            type: 'bar',
            data: dataWithRules,
            itemStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
          } as BarSeriesOption,
        ],
      };
    }
    if (chartType === 'line') {
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'line',
            data: dataWithRules,
            itemStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
            lineStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
          } as LineSeriesOption,
        ],
      };
    }
    if (chartType === 'pie') {
      const pieData = categories.map((cat) => {
        const val = grouped[cat];
        const processed = applyRules(val, config.uiConfig?.rules);

        if (typeof processed === 'object') {
          return { name: cat, value: processed.value, itemStyle: processed.itemStyle };
        }
        return { name: cat, value: processed };
      });

      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: pieData,
          } as PieSeriesOption,
        ],
      };
    }

    if (chartType === 'polar') {
      return {
        ...baseOption,
        polar: { radius: [30, '80%'] },
        angleAxis: { type: 'category', data: categories },
        radiusAxis: { max: 'dataMax' },
        series: [
          {
            type: 'bar',
            data: dataWithRules,
            coordinateSystem: 'polar',
            itemStyle: uiConfig?.color ? { color: uiConfig.color } : undefined,
          } as BarSeriesOption,
        ],
      };
    }

    if (chartType === 'funnel') {
      const funnelData = categories.map((cat) => {
        const val = grouped[cat];
        const processed = applyRules(val, config.uiConfig?.rules);
        if (typeof processed === 'object')
          return { name: cat, value: processed.value, itemStyle: processed.itemStyle };
        return { name: cat, value: processed };
      });

      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [{ type: 'funnel', data: funnelData } as FunnelSeriesOption],
      };
    }

    if (chartType === 'treemap') {
      const treeData = categories.map((cat) => {
        const val = grouped[cat];
        const processed = applyRules(val, config.uiConfig?.rules);
        if (typeof processed === 'object')
          return { name: cat, value: processed.value, itemStyle: processed.itemStyle };
        return { name: cat, value: processed };
      });

      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [{ type: 'treemap', data: treeData } as TreemapSeriesOption],
      };
    }
  }

  const multiSeriesCharts = ['multi_line', 'stacked_line', 'stacked_bar', 'radar'];

  if (multiSeriesCharts.includes(chartType)) {
    const xKey = chartType === 'radar' ? mapping.indicator : mapping.xAxis;
    const yKey = mapping.yAxis || mapping.value;
    const splitKey = mapping.splitBy;

    if (!xKey || !yKey || !splitKey) return {};

    const xCategoriesSet = new Set<string>();
    const splitCategoriesSet = new Set<string>();
    const pivotData: Record<string, Record<string, number>> = {};

    data.forEach((row) => {
      const xVal = String(row[xKey] || 'Неизвестно');
      const yVal = Number(row[yKey]);
      const splitVal = String(row[splitKey] || 'Неизвестно');
      if (!isNaN(yVal)) {
        xCategoriesSet.add(xVal);
        splitCategoriesSet.add(splitVal);
        if (!pivotData[splitVal]) pivotData[splitVal] = {};
        pivotData[splitVal][xVal] = (pivotData[splitVal][xVal] ?? 0) + yVal;
      }
    });

    const xCategories = Array.from(xCategoriesSet);
    const splitCategories = Array.from(splitCategoriesSet);

    if (chartType === 'radar') {
      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        legend: { data: splitCategories, bottom: 0 },
        radar: { indicator: xCategories.map((name) => ({ name })) },
        series: [
          {
            type: 'radar',
            data: splitCategories.map((s) => ({
              name: s,
              value: xCategories.map((x) => pivotData[s][x] || 0),
            })),
          } as RadarSeriesOption,
        ],
      };
    }

    const isStacked = chartType === 'stacked_bar' || chartType === 'stacked_line';
    const seriesType = chartType === 'stacked_bar' ? 'bar' : 'line';

    const series = splitCategories.map((s): BarSeriesOption | LineSeriesOption => {
      const dataPoints = xCategories.map((xCat) => {
        const val = pivotData[s][xCat] || 0;
        return applyRules(val, config.uiConfig?.rules);
      });

      const safeData = dataPoints as unknown as (number | { name?: string; value: number })[];

      return {
        name: s,
        type: seriesType as 'bar' | 'line',
        stack: isStacked ? 'total' : undefined,
        areaStyle: chartType === 'stacked_line' ? {} : undefined,
        data: safeData,
      };
    });

    return {
      ...baseOption,
      legend: { data: splitCategories, bottom: 0 },
      xAxis: { type: 'category', data: xCategories },
      yAxis: { type: 'value' },
      series: series as (BarSeriesOption | LineSeriesOption)[],
    };
  }

  if (chartType === 'candlestick') {
    const { xAxis, open, close, lowest, highest } = mapping;
    if (!xAxis || !open || !close || !lowest || !highest) return {};

    type CandleDataItem =
      | [number, number, number, number]
      | { value: [number, number, number, number]; itemStyle: { color: string } };

    const dates: string[] = [];
    const candleValues: CandleDataItem[] = [];

    data.forEach((row) => {
      const dateVal = String(row[xAxis] || 'Неизвестно');
      const o = Number(row[open]);
      const c = Number(row[close]);
      const l = Number(row[lowest]);
      const h = Number(row[highest]);

      if (!isNaN(o) && !isNaN(c) && !isNaN(l) && !isNaN(h)) {
        dates.push(dateVal);

        const processedClose = applyRules(c, config.uiConfig?.rules);

        if (typeof processedClose === 'object') {
          candleValues.push({
            value: [o, c, l, h],
            itemStyle: processedClose.itemStyle,
          });
        } else {
          candleValues.push([o, c, l, h]);
        }
      }
    });

    return {
      ...baseOption,
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'candlestick',
          data: candleValues as unknown as (number | string | { value: (number | string)[] })[],
        } as CandlestickSeriesOption,
      ],
    };
  }

  return {};
}

function applyRules(val: number, rules?: ChartRule[]): StyledDataPoint {
  if (!rules || rules.length === 0) return val;

  for (const rule of rules) {
    let isMatch = false;
    switch (rule.operator) {
      case '>':
        isMatch = val > rule.value;
        break;
      case '<':
        isMatch = val < rule.value;
        break;
      case '>=':
        isMatch = val >= rule.value;
        break;
      case '<=':
        isMatch = val <= rule.value;
        break;
      case '==':
        isMatch = val === rule.value;
        break;
      case '!=':
        isMatch = val !== rule.value;
        break;
    }

    if (isMatch) {
      return {
        value: val,
        itemStyle: { color: rule.color },
      };
    }
  }

  return val; // Если ни одно правило не подошло, возвращаем обычное число
}
