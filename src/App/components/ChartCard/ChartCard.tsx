import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { transformDataForECharts } from 'App/utils/chartTransformer';
import classNames from 'classnames';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import MoveButton from 'components/IconButtons/MoveButton';
import Delete from 'components/Icons/Delete';
import Edit from 'components/Icons/Edit';
import FullScreen from 'components/Icons/FullScreen';
import Table from 'components/Icons/Table';
import Upload from 'components/Icons/Upload';
import PopupMenu from 'components/PopupMenu';
import PopupMenuBtn from 'components/PopupMenuBtn';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChartConfig, RowData } from 'types/index';

import styles from './ChartCard.module.scss';

type ChartCard = {
  data: RowData[];
  config: ChartConfig;
  id: number;
  isHidden?: boolean;
};

function ChartCard({ data, config, id, isHidden = false }: ChartCard) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [menuIsOpen, setMenuIsOpen] = useState(false);

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
    <article
      ref={setNodeRef}
      style={style}
      className={classNames(styles.chartCard, { [styles.hidden]: isHidden })}
    >
      <div ref={menuRef}>
        <MoreVertButton
          className={styles.moreVert}
          onClick={() => setMenuIsOpen((prev) => !prev)}
        />

        {menuIsOpen && (
          <PopupMenu>
            <PopupMenuBtn icon={<FullScreen />} text="Показать во весь экран" />
            <PopupMenuBtn icon={<Table />} text="Открыть таблицу" />
            <PopupMenuBtn icon={<Upload />} text="Экспортировать" />
            <PopupMenuBtn icon={<Edit />} text="Изменить" />
            <PopupMenuBtn icon={<Delete />} text="Удалить" />
          </PopupMenu>
        )}
      </div>
      <MoveButton className={styles.moveBtn} {...attributes} {...listeners} />
      <ReactECharts option={chartOption} />
    </article>
  );
}

export default ChartCard;
