import ChartBuilder from 'App/components/ChartBuilder';
import { generateEmptyGrid } from 'App/utils/generateEmptyGrid';
import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router';

import styles from './ChartBuilderPage.module.scss';

function ChartBuilerPage() {
  const navigate = useNavigate();
  const { columns, rows } = generateEmptyGrid(3, 5);
  return (
    <div>
      <div className={styles.titleContainer}>
        <BackButton onClick={() => navigate(-1)}>Назад</BackButton>
        <h2 className={styles.title}>Добавление графика</h2>
      </div>
      <ChartBuilder initialColumns={columns} initialRows={rows} />
    </div>
  );
}

export default ChartBuilerPage;
