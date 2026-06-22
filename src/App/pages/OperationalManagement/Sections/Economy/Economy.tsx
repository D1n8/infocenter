import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Economy() {
  const navigate = useNavigate();

  return (
    <Section
      title={'Экономика'}
      blockId="economy"
      onClick={() => navigate(routes.chartListSettings.create('economy'))}
    />
  );
}

export default Economy;
