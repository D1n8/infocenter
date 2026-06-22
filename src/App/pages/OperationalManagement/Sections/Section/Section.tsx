import ChartList from 'App/components/ChartList/ChartList';
import Button from 'components/Button';
import ChartListSkeleton from 'components/ChartListSkeleton/ChartListSkeleton';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore';
import type { CardType, BlockType } from 'types/index';

import styles from './Section.module.scss';

type SectionProps = {
  title: string;
  blockId: BlockType;
  onClick: () => void;
};

const Section = observer(({ title, blockId, onClick }: SectionProps) => {
  const { userStore } = useRootStore();

  const cards: CardType[] = useMemo(() => {
    const rawCharts = toJS(diagramStore.charts);
    const rawDiagrams = toJS(diagramStore.diagrams);

    return rawCharts
      .filter((chart) => rawDiagrams.some((d) => d.id === chart.diagramId && d.block === blockId))
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
              color: chart.uiConfig?.color,
            },
          },
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [diagramStore.charts, diagramStore.diagrams, blockId]);

  const canManage = userStore.canManageBlock(blockId);

  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        {canManage && <Button onClick={onClick} children={'Настроить графики'} />}
      </div>

      {diagramStore.isLoading ? (
        <ChartListSkeleton />
      ) : cards.length > 0 ? (
        <ChartList cards={cards} />
      ) : (
        <div className={styles.emptyState}>В данном разделе пока нет графиков</div>
      )}
    </section>
  );
});

export default Section;
