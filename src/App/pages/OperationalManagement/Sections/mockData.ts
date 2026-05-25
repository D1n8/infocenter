import type { CardType, RowData } from 'types/index';

export const mockData: RowData[] = [
  { department: 'IT', salary: 2000 },
  { department: 'IT', salary: 3000 },
  { department: 'HR', salary: 1500 },
  { department: 'Finance', salary: 2500 },
  { department: 'Support', salary: 1800 },
];

const COLORS = {
  production: '#FADB14',
  economy: '#52C41A',
  safety: '#FF4D4F',
  quality: '#002766',
  culture: '#40A9FF',
};

const createMockCharts = (count: number, titlePrefix: string, color: string): CardType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Math.random(),
    data: mockData,
    config: {
      title: { text: `${titlePrefix} - График ${i + 1}` },
      chartType: 'bar',
      mapping: {
        xAxis: 'department',
        yAxis: 'salary',
      },
      uiConfig: {
        color: color,
      },
    },
  }));
};

export const sectionsData: Record<string, { title: string; charts: CardType[] }> = {
  production: {
    title: 'Производство',
    charts: createMockCharts(6, 'Производство', COLORS.production),
  },
  culture: {
    title: 'Корпоративная культура',
    charts: createMockCharts(6, 'Культура', COLORS.culture),
  },
  economy: {
    title: 'Экономика',
    charts: createMockCharts(6, 'Экономика', COLORS.economy),
  },
  quality: {
    title: 'Качество',
    charts: createMockCharts(6, 'Качество', COLORS.quality),
  },
  safety: {
    title: 'Безопасность',
    charts: createMockCharts(6, 'Безопасность', COLORS.safety),
  },
};
