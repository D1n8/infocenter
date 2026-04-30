import ChartBuilder from 'App/components/ChartBuilder';
import { generateEmptyGrid } from 'App/utils/generateEmptyGrid';
import { useMemo } from 'react';

import Section from '../Section';

import 'react-data-grid/lib/styles.css';

function Production() {
  const { columns, rows } = useMemo(() => generateEmptyGrid(4, 11), []);

  return (
    <Section title="Производство">
      <ChartBuilder initialColumns={columns} initialRows={rows} />
    </Section>
  );
}

export default Production;
