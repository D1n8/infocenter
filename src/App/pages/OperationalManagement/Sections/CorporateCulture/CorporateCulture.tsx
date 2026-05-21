import { useState } from 'react';

import Section from '../Section';
import { config, mockData } from '../mockData';

function CorporateCulture() {
  const [isMaximize, setIsMaximize] = useState(false);

  const [cards, setCards] = useState([
    { id: 1, data: mockData, config },
    { id: 2, data: mockData, config },
    { id: 3, data: mockData, config },
    { id: 4, data: mockData, config },
    { id: 5, data: mockData, config },
    { id: 6, data: mockData, config },
  ]);

  return (
    <Section
      isMaximize={isMaximize}
      setIsMaximize={setIsMaximize}
      cards={cards}
      setCards={setCards}
      title="Корпоративная культура"
    />
  );
}

export default CorporateCulture;
