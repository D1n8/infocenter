import ChartListDraggable from 'App/components/ChartList/ChartListDraggable';
import Button from 'components/Button';
import BackButton from 'components/IconButtons/BackButton';
import { routes } from 'config/routes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { diagramStore } from 'store/DiagramStore';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { CardType } from 'types/index';

import styles from './ChartListSettings.module.scss';

const SECTION_COLORS: Record<string, string> = {
  production: '#FADB14',
  economy: '#52C41A',
  safety: '#FF4D4F',
  quality: '#002766',
  culture: '#40A9FF',
};

const ChartListSettings = observer(() => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();
  const block = sectionId || 'production';

  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    diagramStore.fetchDiagrams(0, 100, block as any);
    diagramStore.fetchCharts();
  }, [block]);

  useEffect(() => {
    const rawCharts = toJS(diagramStore.charts);
    const rawDiagrams = toJS(diagramStore.diagrams);

    if (rawCharts.length > 0 && rawDiagrams.length > 0) {
      const mappedAndSorted = rawCharts
        .filter((chart) => rawDiagrams.some((d) => d.id === chart.diagramId && d.block === block))
        .map((chart) => {
          const diagram = rawDiagrams.find((d) => d.id === chart.diagramId);
          return {
            id: chart.id,
            diagramId: chart.diagramId,
            order: diagram ? (diagram.order ?? 0) : 0,
            data: diagram ? diagram.rows : [],
            config: {
              title: { text: chart.title },
              chartType: chart.chartType,
              mapping: chart.mapping,
              uiConfig: {
                ...chart.uiConfig,
                color: chart.uiConfig?.color || SECTION_COLORS[block],
              },
            },
          };
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setCards(mappedAndSorted);
    }
  }, [diagramStore.charts, diagramStore.diagrams, block]);

  const handleAddChartClick = () => {
    navigate(routes.chartBuilder.create(), {
      state: { block },
    });
  };

  const handleSave = async () => {
    const rawDiagrams = toJS(diagramStore.diagrams);

    const promises = cards.map((card, index) => {
      if (card.order !== index && card.diagramId) {
        const originalDiag = rawDiagrams.find((d) => d.id === card.diagramId);

        if (originalDiag) {
          return diagramStore.updateDiagram(card.diagramId, {
            block: originalDiag.block,
            unit_id: originalDiag.unit_id,
            columns: originalDiag.columns,
            rows: originalDiag.rows,
            order: index,
          });
        }
      }
      return null;
    });

    await Promise.all(promises.filter((p) => p !== null));
    navigate(-1);
  };

  return (
    <div className={styles.chartListSettings}>
      <div className={styles.topContainer}>
        <div className={layoutStyles.titleContainer}>
          <BackButton onClick={() => navigate(-1)}>Назад</BackButton>
          <h2 className={layoutStyles.title}>Настройки</h2>
        </div>
        <Button onClick={handleAddChartClick}>Добавить график</Button>
      </div>

      <ChartListDraggable cards={cards} setCards={setCards} isMaximize={true} />

      <div className={layoutStyles.bottomContainer}>
        <div className={layoutStyles.btnContainer}>
          <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
            Отменить
          </Button>
          <Button onClick={handleSave} disabled={diagramStore.isLoading}>
            {diagramStore.isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ChartListSettings;
