import ChartList from 'App/components/ChartList';
import Button from 'components/Button';
import { useState } from 'react';

import { mockCharts } from '../OperationalManagement/Sections/mockData';

import styles from './ChartListSettings.module.scss';

function ChartListSettings() {
  const [cards, setCards] = useState(mockCharts);
  return (
    <div className={styles.chartListSettings}>
      <Button>Назад</Button>
      <Button>Добавить график</Button>
      <ChartList cards={cards} setCards={setCards} />
      <Button>Отменить</Button>
      <Button>Сохранить</Button>
    </div>
  );
}

export default ChartListSettings;
