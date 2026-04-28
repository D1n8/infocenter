import ChartBuilder from 'App/components/ChartBuilder';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Production() {
  return (
    <Section title="Производство">
      <ChartBuilder initialColumns={[]} initialRows={[]} />
    </Section>
  );
}

export default Production;
