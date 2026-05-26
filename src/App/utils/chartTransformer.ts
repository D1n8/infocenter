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
import type { RowData, ChartConfig } from 'types/index';

type TooltipParam = {
  seriesName: string;
  value: number;
  axisValue: string;
};

type FormatterParams = {
  value: [number, number, string];
};

export function transformDataForECharts(data: RowData[], config: ChartConfig): EChartsOption {
  const { chartType, mapping, title } = config;

  const baseOption: EChartsOption = {
    title: { text: title.text, textStyle: { fontSize: 14, fontWeight: 400 } },
    tooltip: { trigger: 'axis' },
  };

  if (chartType === 'scatter') {
    if (!mapping.xAxis || !mapping.yAxis) return {};
    const scatterData = data
      .map((row) => {
        const x = Number(row[mapping.xAxis]);
        const y = Number(row[mapping.yAxis]);
        const name = mapping.name ? String(row[mapping.name]) : '';
        return !isNaN(x) && !isNaN(y) ? [x, y, name] : null;
      })
      .filter((item): item is [number, number, string] => item !== null);

    return {
      ...baseOption,
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const p = params as unknown as FormatterParams;
          const [x, y, pointName] = p.value;
          const nameHtml = pointName ? `<b>${pointName}</b><br/>` : '';
          return `${nameHtml}X: ${x}<br/>Y: ${y}`;
        },
      },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'scatter',
          data: scatterData,
          label: {
            show: !!mapping.name,
            formatter: (params) => {
              const p = params as unknown as FormatterParams;
              return p.value[2] || '';
            },
            position: 'right',
          },
        } as ScatterSeriesOption,
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

    if (chartType === 'bar' || chartType === 'horizontal_bar') {
      return {
        ...baseOption,
        xAxis: isHBar ? { type: 'value' } : { type: 'category', data: categories },
        yAxis: isHBar ? { type: 'category', data: categories } : { type: 'value' },
        series: [{ type: 'bar', data: values } as BarSeriesOption],
      };
    }
    if (chartType === 'line') {
      return {
        ...baseOption,
        xAxis: { type: 'category', data: categories },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: values } as LineSeriesOption],
      };
    }
    if (chartType === 'pie') {
      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: categories.map((cat) => ({ name: cat, value: grouped[cat] })),
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
        series: [{ type: 'bar', data: values, coordinateSystem: 'polar' } as BarSeriesOption],
      };
    }
    if (chartType === 'funnel') {
      const funnelData = categories.map((cat) => ({ name: cat, value: grouped[cat] }));
      return {
        ...baseOption,
        tooltip: { trigger: 'item' },
        series: [{ type: 'funnel', data: funnelData } as FunnelSeriesOption],
      };
    }
    if (chartType === 'treemap') {
      const treeData = categories.map((cat) => ({ name: cat, value: grouped[cat] }));
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

    const series = splitCategories.map((s): BarSeriesOption | LineSeriesOption => ({
      name: s,
      type: seriesType as 'bar' | 'line',
      stack: isStacked ? 'total' : undefined,
      areaStyle: chartType === 'stacked_line' ? {} : undefined,
      data: xCategories.map((x) => pivotData[s][x] || 0),
    }));

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

    const dates: string[] = [];
    const candleValues: number[][] = [];

    data.forEach((row) => {
      const dateVal = String(row[xAxis] || 'Неизвестно');
      const o = Number(row[open]);
      const c = Number(row[close]);
      const l = Number(row[lowest]);
      const h = Number(row[highest]);

      if (!isNaN(o) && !isNaN(c) && !isNaN(l) && !isNaN(h)) {
        dates.push(dateVal);
        candleValues.push([o, c, l, h]);
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
          data: candleValues,
        } as CandlestickSeriesOption,
      ],
    };
  }

  return {};
}
