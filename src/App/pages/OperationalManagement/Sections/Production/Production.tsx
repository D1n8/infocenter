import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Production() {
  const navigate = useNavigate();

  return (
    <Section
      title="Производство"
      blockId="production"
      onClick={() => navigate(routes.chartListSettings.create('production'))}
    />
  );
}

export default Production;
