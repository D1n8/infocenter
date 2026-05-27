import ChartListDraggable from 'App/components/ChartList/ChartListDraggable';
import Button from 'components/Button';
import BackButton from 'components/IconButtons/BackButton';
import { routes } from 'config/routes';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

import { sectionsData } from '../OperationalManagement/Sections/mockData';

import styles from './ChartListSettings.module.scss';

function ChartListSettings() {
  const navigate = useNavigate();

  const { sectionId } = useParams<{ sectionId: string }>();
  const currentSection = sectionsData[sectionId ?? 'production'];

  const [cards, setCards] = useState(currentSection.charts);

  return (
    <div className={styles.chartListSettings}>
      <div className={styles.topContainer}>
        <div className={layoutStyles.titleContainer}>
          <BackButton onClick={() => navigate(-1)}>Назад</BackButton>
          <h2 className={layoutStyles.title}>{currentSection.title}</h2>
        </div>
        <Button onClick={() => navigate(routes.chartBuilder.create())}>Добавить график</Button>
      </div>
      <ChartListDraggable cards={cards} setCards={setCards} isMaximize={true} />
      <div className={layoutStyles.bottomContainer}>
        <div className={layoutStyles.btnContainer}>
          <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
            Отменить
          </Button>
          <Button>Сохранить</Button>
        </div>
      </div>
    </div>
  );
}

export default ChartListSettings;
