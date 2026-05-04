import { useState } from 'react';

import Section from '../Section';

function CorporateCulture() {
  const [isMaximize, setIsMaximize] = useState(true);
  return (
    <Section isMaximize={isMaximize} setIsMaximize={setIsMaximize} title="Корпоративная культура" />
  );
}

export default CorporateCulture;
