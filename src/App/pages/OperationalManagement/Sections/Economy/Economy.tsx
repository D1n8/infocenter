import { useState } from 'react';

import Section from '../Section';
import { config, mockData } from '../mockData';

function Economy() {
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
      title="Экономика"
    />
  );
}

export default Economy;
