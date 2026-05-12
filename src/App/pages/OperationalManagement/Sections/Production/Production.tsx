import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';
import { sectionsData } from '../mockData';

function Production() {
  const [isMaximize, setIsMaximize] = useState(false);
  const navigate = useNavigate();

  const section = sectionsData['production'];

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      cards={section.charts}
      setCards={() => {}}
      title={section.title}
      onClick={() => navigate(routes.chartListSettings.create('production'))}
    />
  );
}

export default Production;
