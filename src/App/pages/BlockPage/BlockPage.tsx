import ChartCard from 'App/components/ChartCard/ChartCard';
import classNames from 'classnames';
import Button from 'components/Button';
import { routes } from 'config/routes';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
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

const BLOCKS: { id: BlockType; label: string }[] = [
  { id: 'safety', label: 'Безопасность' },
  { id: 'production', label: 'Производство' },
  { id: 'quality', label: 'Качество' },
  { id: 'economy', label: 'Экономика' },
  { id: 'culture', label: 'Корпоративная культура' },
];

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

  // Состояния для выпадающего меню заголовка
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике снаружи
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleBlockSelect = (id: BlockType) => {
    setIsDropdownOpen(false);
    navigate(routes.dashboardBlock.create(id));
  };

  const canManage = userStore.canManageBlock(block);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        {/* Интерактивный заголовок с выпадающим меню */}
        <div className={styles.titleContainer} ref={dropdownRef}>
          <div
            className={styles.titleDropdownTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <h1 className={styles.title}>{BLOCK_NAMES[block] || 'Блок'}</h1>
            <svg
              className={classNames(styles.arrow, isDropdownOpen && styles.open)}
              width="8"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className={styles.titleDropdownMenu}>
              {BLOCKS.map(
                (b) =>
                  userStore.hasBlockAccess(b.id) && (
                    <div
                      key={b.id}
                      className={classNames(
                        styles.titleDropdownItem,
                        block === b.id && styles.activeItem
                      )}
                      onClick={() => handleBlockSelect(b.id)}
                    >
                      {b.label}
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {canManage && (
          <Button
            className={styles.headerBtn}
            onClick={() => navigate(routes.chartListSettings.create(block))}
          >
            Настроить
          </Button>
        )}
      </div>

      {diagramStore.isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <span className={styles.loaderText}>Загрузка графиков...</span>
        </div>
      ) : cards.length > 0 ? (
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
