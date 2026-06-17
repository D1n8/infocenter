import ChartListDraggable from 'App/components/ChartList/ChartListDraggable';
import Button from 'components/Button';
import ChartListSkeleton from 'components/ChartListSkeleton/ChartListSkeleton';
import PageTitle from 'components/PageTitle';
import SaveButtons from 'components/SaveButtons';
import { routes } from 'config/routes';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { diagramStore } from 'store/DiagramStore';
import type { CardType, BlockType } from 'types/index';

import styles from './ChartListSettings.module.scss';

const ChartListSettings = observer(() => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();
  const block = (sectionId as BlockType) || 'production';

  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    diagramStore.fetchDashboardData(block);
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
              uiConfig: chart.uiConfig,
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
    const promises = cards.map((card, index) => {
      if (card.order !== index && card.diagramId) {
        return diagramStore.updateDiagram(card.diagramId, {
          order: index,
        });
      }
      return null;
    });

    await Promise.all(promises.filter((p) => p !== null));
    navigate(-1);
  };

  return (
    <div className={styles.chartListSettings}>
      <div className={styles.topContainer}>
        <PageTitle title="Настройки" />
        <Button onClick={handleAddChartClick}>Добавить график</Button>
      </div>

      {diagramStore.isLoading ? (
        <ChartListSkeleton />
      ) : (
        <ChartListDraggable cards={cards} setCards={setCards} isMaximize={true} />
      )}

      <SaveButtons handleSave={handleSave} isLoading={diagramStore.isLoading} />
    </div>
  );
});

export default ChartListSettings;
