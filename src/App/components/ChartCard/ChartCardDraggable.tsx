import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { transformDataForECharts } from 'App/utils/chartTransformer';
import Button from 'components/Button';
import MoreVertButton from 'components/IconButtons/MoreVertButton';
import MoveButton from 'components/IconButtons/MoveButton';
import Delete from 'components/Icons/Delete';
import Edit from 'components/Icons/Edit';
import FullScreen from 'components/Icons/FullScreen';
import Modal from 'components/Modal';
import PopupMenu from 'components/PopupMenu';
import PopupMenuBtn from 'components/PopupMenuBtn';
import { routes } from 'config/routes';
import ReactECharts from 'echarts-for-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { diagramStore } from 'store/DiagramStore';

import type { ChartCardType } from './ChartCard';
import styles from './ChartCard.module.scss';

const ChartCardDraggable = observer(({ data, config, id, diagramId }: ChartCardType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();
  const currentBlock = sectionId || 'production';

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [fullScreenIsOpen, setFullScreenIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

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

  const handleEditClick = () => {
    setMenuIsOpen(false);
    navigate(routes.chartBuilder.create(), {
      state: {
        isEditing: true,
        chartId: id,
        diagramId,
        block: currentBlock,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (diagramId) {
      await diagramStore.deleteChart(id);
      await diagramStore.deleteDiagram(diagramId);
      setDeleteModalIsOpen(false);
    }
  };

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
              <PopupMenuBtn onClick={handleEditClick} icon={<Edit />} text="Изменить" />
              <PopupMenuBtn
                onClick={() => {
                  setDeleteModalIsOpen(true);
                  setMenuIsOpen(false);
                }}
                icon={<Delete />}
                text="Удалить"
              />
            </PopupMenu>
          )}
        </div>

        <MoveButton className={styles.moveBtn} {...attributes} {...listeners} />
        <ReactECharts option={chartOption} notMerge={true} />
      </article>

      <Modal isOpen={fullScreenIsOpen} onClose={() => setFullScreenIsOpen(false)}>
        <ReactECharts option={chartOption} style={{ height: '100%' }} notMerge={true} />
      </Modal>

      <Modal isOpen={deleteModalIsOpen} onClose={() => setDeleteModalIsOpen(false)} size="small">
        <div style={{ textAlign: 'center' }}>
          <h3>Подтверждение удаления</h3>
          <p style={{ margin: '16px 0 24px', color: '#666' }}>
            Вы уверены, что хотите удалить этот график? Это действие нельзя будет отменить.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button
              onClick={() => setDeleteModalIsOpen(false)}
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #d9d9d9' }}
            >
              Отменить
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              style={{ background: '#ff4d4f', color: '#fff', border: 'none' }}
            >
              Да, удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default ChartCardDraggable;
