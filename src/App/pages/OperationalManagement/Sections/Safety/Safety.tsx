import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Safety() {
  const navigate = useNavigate();

  return (
    <Section
      title={'Безопасность'}
      blockId="safety"
      onClick={() => navigate(routes.chartListSettings.create('safety'))}
    />
  );
}

export default Safety;
