import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import Section from '../Section';
import 'react-data-grid/lib/styles.css';
import { mockCharts } from '../mockData';

function Production() {
  const [isMaximize, setIsMaximize] = useState(false);
  const navigate = useNavigate();

  const [cards, setCards] = useState(mockCharts);

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      cards={cards}
      setCards={setCards}
      title="Производство"
      onClick={() => navigate(routes.chartListSettings.mask)}
    />
  );
}

export default Production;
