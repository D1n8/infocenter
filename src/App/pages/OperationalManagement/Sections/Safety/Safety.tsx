import { useState } from 'react';

import Section from '../Section';

function Safety() {
  const [isMaximize, setIsMaximize] = useState(true);
  return <Section isMaximize={isMaximize} setIsMaximize={setIsMaximize} title="Безопасность" />;
}

export default Safety;
