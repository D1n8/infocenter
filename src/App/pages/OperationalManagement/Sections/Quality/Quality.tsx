import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Quality() {
  const navigate = useNavigate();

  return (
    <Section
      title={'Качество'}
      blockId="quality"
      onClick={() => navigate(routes.chartListSettings.create('quality'))}
    />
  );
}

export default Quality;
