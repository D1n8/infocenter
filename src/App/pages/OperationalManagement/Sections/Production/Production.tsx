import ChartCard from 'App/components/ChartCard';
import { useState } from 'react';
import type { ChartConfig, RowData } from 'types/index';

import Section from '../Section';

import 'react-data-grid/lib/styles.css';

function Production() {
  const [isMaximize, setIsMaximize] = useState(true);
  const mockData: RowData[] = [
    { department: 'IT', salary: 2000 },
    { department: 'IT', salary: 3000 },
    { department: 'HR', salary: 1500 },
  ];
  const config: ChartConfig = {
    title: { text: 'ПА выпуска продукта в цехе' },
    xAxis: 'department',
    yAxis: 'salary',
    chartType: 'bar',
  };

  return (
    <Section isMaximize={isMaximize} setIsMaximize={setIsMaximize} title="Производство">
      <ChartCard data={mockData} config={config} />
      <ChartCard data={mockData} config={config} />
      <ChartCard data={mockData} config={config} />
    </Section>
  );
}

export default Production;
