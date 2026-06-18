import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import ChartCardCompare from 'App/components/ChartCard/ChartCardCompare'; // Импортируем новый компонент
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import Modal from 'components/Modal';
import PageTitle from 'components/PageTitle/PageTitle';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { diagramStore } from 'store/DiagramStore';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { CardType } from 'types/index';

import styles from './ChartsComparisonPage.module.scss';

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
  culture: 'Культура',
};

const ChartsComparisonPage = observer(() => {
  const [selectedChartIds, setSelectedChartIds] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    diagramStore.fetchDashboardData();
  }, []);

  const allAvailableCharts = useMemo(() => {
    const rawCharts = toJS(diagramStore.charts);
    const rawDiagrams = toJS(diagramStore.diagrams);

    return rawCharts
      .map((chart) => {
        const diagram = rawDiagrams.find((d) => d.id === chart.diagramId);
        if (!diagram) return null;

        const card: CardType = {
          id: chart.id,
          diagramId: chart.diagramId,
          data: diagram.rows,
          config: {
            title: { text: chart.title },
            chartType: chart.chartType,
            mapping: chart.mapping,
            uiConfig: {
              ...chart.uiConfig,
              color: chart.uiConfig?.color || SECTION_COLORS[diagram.block],
            },
          },
        };

        return {
          id: chart.id,
          title: chart.title,
          block: diagram.block,
          blockName: BLOCK_NAMES[diagram.block] || 'Неизвестный блок',
          cardData: card,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [diagramStore.charts, diagramStore.diagrams]);

  const filteredModalCharts = useMemo(() => {
    return allAvailableCharts.filter((chart) =>
      chart.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAvailableCharts, searchQuery]);

  // Генерируем массив карточек строго в том порядке, в каком идут ID в selectedChartIds
  const selectedCardsToRender = useMemo(() => {
    return selectedChartIds
      .map((id) => allAvailableCharts.find((chart) => chart.id === id)?.cardData)
      .filter((card): card is CardType => card !== undefined);
  }, [allAvailableCharts, selectedChartIds]);

  const handleOpenModal = () => {
    setTempSelectedIds([...selectedChartIds]);
    setSearchQuery('');
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    setSelectedChartIds([...tempSelectedIds]);
    setIsModalOpen(false);
  };

  const toggleCheckbox = (id: number) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  // --- ЛОГИКА DND (ПЕРЕТАСКИВАНИЯ) ---
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedChartIds((items) => {
        const oldIndex = items.indexOf(Number(active.id));
        const newIndex = items.indexOf(Number(over.id));
        return arrayMove(items, oldIndex, newIndex); // Обновляем порядок в стейте!
      });
    }
  };

  return (
    <>
      <PageTitle title="Сравнение графиков" />

      <div className={layoutStyles.settingsContainer}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Button onClick={handleOpenModal}>Добавить график</Button>
        </div>

        {diagramStore.isLoading && selectedCardsToRender.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Загрузка...</div>
        ) : selectedCardsToRender.length > 0 ? (
          /* --- ОБЕРТКА DND КОНТЕКСТА --- */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <SortableContext items={selectedChartIds} strategy={rectSortingStrategy}>
              {/* Мы используем обычный div, так как нам больше не нужна логика лимитов из ChartList */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '20px',
                }}
              >
                {selectedCardsToRender.map((card) => (
                  <ChartCardCompare
                    key={card.id}
                    id={card.id}
                    diagramId={card.diagramId}
                    data={card.data}
                    config={card.config}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Нет выбранных графиков. Нажмите «Добавить график», чтобы начать сравнение.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="small">
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>Выберите графики</h3>

          <Input
            icon={<Search />}
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />

          <div className={styles.chartListContainer}>
            {filteredModalCharts.length > 0 ? (
              filteredModalCharts.map((chart) => (
                <label key={chart.id} className={styles.chartItemLabel}>
                  <input
                    type="checkbox"
                    checked={tempSelectedIds.includes(chart.id)}
                    onChange={() => toggleCheckbox(chart.id)}
                    className={styles.checkbox}
                  />
                  <div className={styles.chartInfo}>
                    <span className={styles.chartTitle}>{chart.title}</span>
                    <span className={styles.chartBlock}>({chart.blockName})</span>
                  </div>
                </label>
              ))
            ) : (
              <div className={styles.emptySearch}>Графики не найдены</div>
            )}
          </div>

          <div className={styles.modalActions}>
            <Button className={layoutStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>
              Отменить
            </Button>
            <Button onClick={handleSaveModal}>Сохранить</Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default ChartsComparisonPage;
