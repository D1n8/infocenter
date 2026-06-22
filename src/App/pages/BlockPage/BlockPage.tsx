import ChartCard from 'App/components/ChartCard/ChartCard';
import Button from 'components/Button';
import { routes } from 'config/routes';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore';
import type { BlockType, CardType } from 'types/index';

import styles from './BlockPage.module.scss';

const SECTION_COLORS: Record<string, string> = {
  production: '#FADB14',
  economy: '#52C41A',
  safety: '#FF4D4F',
  quality: '#002766',
  culture: '#40A9FF',
};

const BLOCK_NAMES: Record<string, string> = {
  production: 'Производство',
  economy: 'Экономика',
  safety: 'Безопасность',
  quality: 'Качество',
  culture: 'Корпоративная культура',
};

const BlockPage = observer(() => {
  const { blockId } = useParams<{ blockId: string }>();
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  const block = (blockId as BlockType) || 'production';

  useEffect(() => {
    diagramStore.fetchDashboardData(block);
  }, [block]);

  const cards: CardType[] = useMemo(() => {
    const rawCharts = toJS(diagramStore.charts);
    const rawDiagrams = toJS(diagramStore.diagrams);

    return rawCharts
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
  }, [diagramStore.charts, diagramStore.diagrams, block]);

  if (!userStore.hasBlockAccess(block)) {
    return <Navigate to={routes.main.create()} replace />;
  }

  const canManage = userStore.canManageBlock(block);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{BLOCK_NAMES[block] || 'Блок'}</h1>
        {canManage && (
          <Button onClick={() => navigate(routes.chartListSettings.create(block))}>
            Настроить
          </Button>
        )}
      </div>

      {cards.length > 0 ? (
        <div className={styles.grid}>
          {cards.map((card) => (
            <ChartCard key={card.id} id={card.id} data={card.data} config={card.config} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Нет графиков для отображения</p>
      )}
    </div>
  );
});

export default BlockPage;
