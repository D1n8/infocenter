import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { transformDataForECharts } from 'App/utils/chartTransformer';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import MoveButton from 'components/IconButtons/MoveButton';
import FullScreen from 'components/Icons/FullScreen';
import Modal from 'components/Modal';
import PopupMenu from 'components/PopupMenu';
import PopupMenuBtn from 'components/PopupMenuBtn';
import ReactECharts from 'echarts-for-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ChartCardType } from './ChartCard';
import styles from './ChartCard.module.scss';

const ChartCardCompare = observer(({ data, config, id }: ChartCardType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [fullScreenIsOpen, setFullScreenIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuIsOpen(false);
      }
    };

    if (menuIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuIsOpen]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const chartOption = useMemo(() => {
    return transformDataForECharts(data, config);
  }, [data, config]);

  return (
    <>
      <article ref={setNodeRef} style={style} className={styles.chartCard}>
        <div ref={menuRef}>
          <MoreVertButton
            className={styles.moreVert}
            onClick={() => setMenuIsOpen((prev) => !prev)}
          />

          {menuIsOpen && (
            <PopupMenu>
              <PopupMenuBtn
                onClick={() => {
                  setFullScreenIsOpen(true);
                  setMenuIsOpen(false);
                }}
                icon={<FullScreen />}
                text="Показать во весь экран"
              />
            </PopupMenu>
          )}
        </div>

        {/* Ручка для перетаскивания (Drag Handle) */}
        <MoveButton className={styles.moveBtn} {...attributes} {...listeners} />

        <ReactECharts option={chartOption} notMerge={true} />
      </article>

      <Modal isOpen={fullScreenIsOpen} onClose={() => setFullScreenIsOpen(false)}>
        <ReactECharts option={chartOption} style={{ height: '100%' }} notMerge={true} />
      </Modal>
    </>
  );
});

export default ChartCardCompare;
