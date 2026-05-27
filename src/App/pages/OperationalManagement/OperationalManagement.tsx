import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { diagramStore } from 'store/DiagramStore';

import styles from './OperationalManagement.module.scss';
import CorporateCulture from './Sections/CorporateCulture';
import Economy from './Sections/Economy';
import Production from './Sections/Production';
import Quality from './Sections/Quality';
import Safety from './Sections/Safety';

const OperationalManagement = observer(() => {
  useEffect(() => {
    diagramStore.fetchDiagrams(0, 100);
    diagramStore.fetchCharts();

    return () => {
      diagramStore.resetStore();
    };
  }, []);

  if (diagramStore.isLoading && diagramStore.diagrams.length === 0) {
    return <div className={styles.loading}>Загрузка дашборда...</div>;
  }

  return (
    <div className={styles.container}>
      <Production />
      <Economy />
      <Safety />
      <Quality />
      <CorporateCulture />
    </div>
  );
});

export default OperationalManagement;
