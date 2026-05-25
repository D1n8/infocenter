import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';
import { sectionsData } from '../mockData';

function Economy() {
  const [isMaximize, setIsMaximize] = useState(false);
  const navigate = useNavigate();
  const data = sectionsData['economy'];

  const [section, setSection] = useState(data.charts);

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      cards={section}
      setCards={setSection}
      title={data.title}
      onClick={() => navigate(routes.chartListSettings.create('economy'))}
    />
  );
}

export default Economy;
