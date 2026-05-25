import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';
import { sectionsData } from '../mockData';

function Quality() {
  const [isMaximize, setIsMaximize] = useState(false);
  const navigate = useNavigate();
  const data = sectionsData['quality'];

  const [section, setSection] = useState(data.charts);

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      cards={section}
      setCards={setSection}
      title={data.title}
      onClick={() => navigate(routes.chartListSettings.create('quality'))}
    />
  );
}

export default Quality;
