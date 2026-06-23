import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import type { BlockType } from 'types/index';

import styles from './DashboardMenu.module.scss';

const BLOCKS: { id: BlockType; label: string; color: string }[] = [
  { id: 'safety', label: 'Безопасность', color: '#FF4D4F' },
  { id: 'production', label: 'Производство', color: '#FADB14' },
  { id: 'quality', label: 'Качество', color: '#002766' },
  { id: 'economy', label: 'Экономика', color: '#52C41A' },
  { id: 'culture', label: 'Корпоративная культура', color: '#40A9FF' },
];

const DashboardMenu = observer(() => {
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  const availableBlocks = BLOCKS.filter((block) => userStore.hasBlockAccess(block.id));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Главное меню дашбордов</h1>
      <p className={styles.subtitle}>Выберите интересующий вас раздел</p>

      {availableBlocks.length > 0 ? (
        <div className={styles.grid}>
          {availableBlocks.map((block) => (
            <div
              key={block.id}
              className={styles.card}
              onClick={() => navigate(routes.dashboardBlock.create(block.id))}
              style={{ borderTop: `4px solid ${block.color}` }}
            >
              <h3 className={styles.cardTitle}>{block.label}</h3>
              <div className={styles.cardArrow}>→</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          У вас нет доступа ни к одному из разделов. Обратитесь к администратору.
        </div>
      )}
    </div>
  );
});

export default DashboardMenu;
