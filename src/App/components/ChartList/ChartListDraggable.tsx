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
import { useEffect, useState } from 'react';
import type { ChartListType } from 'types/index';

import ChartCardDraggable from '../ChartCard/ChartCardDraggable';

import styles from './ChartList.module.scss';

function ChartListDraggable({ isMaximize, cards, setCards }: ChartListType) {
  const [hasRenderedAll, setHasRenderedAll] = useState(isMaximize);

  useEffect(() => {
    if (isMaximize && !hasRenderedAll) {
      setHasRenderedAll(true);
    }
  }, [isMaximize, hasRenderedAll]);
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

  const renderedCards = hasRenderedAll ? cards : cards.slice(0, 3);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
        <div className={styles.chartList}>
          {renderedCards.map((card) => {
            return (
              <ChartCardDraggable
                key={card.id}
                id={card.id}
                data={card.data}
                config={card.config}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default ChartListDraggable;
