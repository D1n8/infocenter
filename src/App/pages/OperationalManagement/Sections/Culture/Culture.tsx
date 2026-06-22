import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Culture() {
  const navigate = useNavigate();

  return (
    <Section
      title={'Корпоративная культура'}
      blockId="culture"
      onClick={() => navigate(routes.chartListSettings.create('culture'))}
    />
  );
}

export default Culture;
