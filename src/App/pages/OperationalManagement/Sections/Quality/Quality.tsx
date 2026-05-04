import { useState } from 'react';

import Section from '../Section';

function Quality() {
  const [isMaximize, setIsMaximize] = useState(true);
  return <Section isMaximize={isMaximize} setIsMaximize={setIsMaximize} title="Качество" />;
}

export default Quality;
