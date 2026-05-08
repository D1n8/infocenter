import ChartList from 'App/components/ChartList';
import Button from 'components/Button';
import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { mockCharts } from '../OperationalManagement/Sections/mockData';

import styles from './ChartListSettings.module.scss';

function ChartListSettings() {
  const [cards, setCards] = useState(mockCharts);
  const navigate = useNavigate();
  return (
    <div className={styles.chartListSettings}>
      <Button onClick={() => navigate(-1)}>Назад</Button>
      <Button onClick={() => navigate(routes.chartBuilder.create())}>Добавить график</Button>
      <ChartList cards={cards} setCards={setCards} />
      <Button>Отменить</Button>
      <Button>Сохранить</Button>
    </div>
  );
}

export default ChartListSettings;
