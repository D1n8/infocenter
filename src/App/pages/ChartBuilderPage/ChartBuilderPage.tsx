import ChartBuilder from 'App/components/ChartBuilder';
import { generateEmptyGrid } from 'App/utils/generateEmptyGrid';
import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router';
import layoutStyles from 'styles/shared/Layout.module.scss';

function ChartBuilerPage() {
  const navigate = useNavigate();
  const { columns, rows } = generateEmptyGrid(3, 5);
  return (
    <div>
      <div className={layoutStyles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={layoutStyles.title}>Добавление графика</h2>
      </div>
      <ChartBuilder initialColumns={columns} initialRows={rows} />
    </div>
  );
}

export default ChartBuilerPage;
