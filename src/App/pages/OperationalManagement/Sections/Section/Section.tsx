import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import ChartCard from 'App/components/ChartCard';
import classNames from 'classnames';
import Button from 'components/Button';
import MaximizeButton from 'components/IconButtons/MaximizeButton';
import MinimizeButton from 'components/IconButtons/MinimizeButton';
import type { ChartConfig, RowData } from 'types/index';

import styles from './Section.module.scss';

type CardType = {
  id: number;
  data: RowData[];
  config: ChartConfig;
};

type SectionType = {
  isMaximize: boolean;
  setIsMaximize: (flag: boolean) => void;
  cards: CardType[];
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
  title?: string;
  onClick?: () => void;
};

function Section({ isMaximize, setIsMaximize, cards, setCards, title, onClick }: SectionType) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.topContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
          {isMaximize ? (
            <MaximizeButton
              onClick={() => setIsMaximize(false)}
              className={classNames(styles.sizeBtn, styles.maxBtn)}
            />
          ) : (
            <MinimizeButton
              onClick={() => setIsMaximize(true)}
              className={classNames(styles.sizeBtn, styles.minBtn)}
            />
          )}
        </div>
        <Button onClick={onClick} children={'Настроить графики'} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className={styles.sectionContainer}>
            {cards.map((card) => (
              <ChartCard key={card.id} id={card.id} data={card.data} config={card.config} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

export default Section;
