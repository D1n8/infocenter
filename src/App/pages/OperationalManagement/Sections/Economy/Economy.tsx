import { useState } from 'react';

import Section from '../Section';

function Economy() {
  const [isMaximize, setIsMaximize] = useState(true);
  return <Section isMaximize={isMaximize} setIsMaximize={setIsMaximize} title="Экономика" />;
}

export default Economy;
