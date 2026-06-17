import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';

function Quality() {
  const [isMaximize, setIsMaximize] = useState(false);
  const navigate = useNavigate();

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      title={'Качество'}
      blockId="quality"
      onClick={() => navigate(routes.chartListSettings.create('quality'))}
    />
  );
}

export default Quality;
