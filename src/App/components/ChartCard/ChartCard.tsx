import { transformDataForECharts } from 'App/utils/chartTransformer';
import classNames from 'classnames';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import FullScreen from 'components/Icons/FullScreen';
import Modal from 'components/Modal';
import PopupMenu from 'components/PopupMenu';
import PopupMenuBtn from 'components/PopupMenuBtn';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChartConfig, RowData } from 'types/index';

import styles from './ChartCard.module.scss';

export type ChartCardType = {
  data: RowData[];
  config: ChartConfig;
  id: number;
  diagramId?: string;
  isHidden?: boolean;
};

function ChartCard({ data, config, isHidden = false }: ChartCardType) {
  const [fullScreenIsOpen, setFullScreenIsOpen] = useState(false);
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

  const chartOption = useMemo(() => {
    return transformDataForECharts(data, config);
  }, [data, config]);

  return (
    <>
      <article className={classNames(styles.chartCard, { [styles.hidden]: isHidden })}>
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
        <ReactECharts option={chartOption} notMerge={true} />
      </article>

      <Modal isOpen={fullScreenIsOpen} onClose={() => setFullScreenIsOpen(false)}>
        <ReactECharts option={chartOption} style={{ height: '100%' }} notMerge={true} />
      </Modal>
    </>
  );
}

export default ChartCard;
