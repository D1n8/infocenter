import ChartList from 'App/components/ChartList/ChartList';
import classNames from 'classnames';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import type { DropdownOption } from 'components/Dropdown/Dropdown';
import MaximizeButton from 'components/IconButtons/MaximizeButton';
import MinimizeButton from 'components/IconButtons/MinimizeButton';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useMemo } from 'react';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore';
import type { CardType, BlockType } from 'types/index';

import styles from './Section.module.scss';

const LIMIT_OPTIONS: DropdownOption[] = [
  { value: '6', label: 'Показать 6 графиков' },
  { value: '9', label: 'Показать 9 графиков' },
  { value: '12', label: 'Показать 12 графиков' },
  { value: 'all', label: 'Показать все графики' },
];

const SECTION_COLORS: Record<string, string> = {
  production: '#FADB14',
  economy: '#52C41A',
  safety: '#FF4D4F',
  quality: '#002766',
  culture: '#40A9FF',
};

interface SectionProps {
  isMaximize: boolean;
  setIsMaximize: (flag: boolean) => void;
  title: string;
  blockId: BlockType;
  onClick: () => void;
}

const Section = observer(({ isMaximize, setIsMaximize, title, blockId, onClick }: SectionProps) => {
  const { userStore } = useRootStore();
  const [hasRenderedAll, setHasRenderedAll] = useState(isMaximize);
  const [limit, setLimit] = useState<string>('6');

  useEffect(() => {
    diagramStore.fetchDiagrams(0, 100, blockId);
    diagramStore.fetchCharts();
  }, [blockId]);

  useEffect(() => {
    if (isMaximize && !hasRenderedAll) {
      setHasRenderedAll(true);
    }
  }, [isMaximize, hasRenderedAll]);

  useEffect(() => {
    if (!isMaximize) {
      setLimit('6');
    }
  }, [isMaximize]);

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
              color: chart.uiConfig?.color || SECTION_COLORS[blockId],
            },
          },
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [diagramStore.charts, diagramStore.diagrams, blockId]);

  useEffect(() => {
    if (cards.length <= 3 && isMaximize) {
      setIsMaximize(false);
    }
  }, [cards.length, isMaximize, setIsMaximize]);

  const handleLimitChange = (opt: DropdownOption) => {
    setLimit(String(opt.value));
  };

  const canManage = userStore.canManageBlock(blockId);
  const hasMoreThanThree = cards.length > 3;

  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>

          {hasMoreThanThree &&
            (isMaximize ? (
              <MinimizeButton
                onClick={() => setIsMaximize(false)}
                className={classNames(styles.sizeBtn, styles.minBtn)}
              />
            ) : (
              <MaximizeButton
                onClick={() => setIsMaximize(true)}
                className={classNames(styles.sizeBtn, styles.maxBtn)}
              />
            ))}

          {isMaximize && hasMoreThanThree && (
            <Dropdown
              id={`limit-select-${title}`}
              options={LIMIT_OPTIONS}
              value={limit}
              onChange={handleLimitChange}
            />
          )}
        </div>
        {canManage && <Button onClick={onClick} children={'Настроить графики'} />}
      </div>

      {diagramStore.isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Загрузка графиков...</span>
        </div>
      ) : (
        <ChartList isMaximize={isMaximize} cards={cards} setCards={() => {}} limit={limit} />
      )}
    </section>
  );
});

export default Section;
