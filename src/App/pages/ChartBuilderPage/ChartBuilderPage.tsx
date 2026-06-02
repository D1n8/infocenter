import ChartBuilder from 'App/components/ChartBuilder';
import { generateEmptyGrid } from 'App/utils/generateEmptyGrid';
import BackButton from 'components/IconButtons/BackButton';
import { useNavigate, useLocation } from 'react-router';
import layoutStyles from 'styles/shared/Layout.module.scss';

function ChartBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateContext = location.state as { isEditing?: boolean } | null;
  const isEditing = stateContext?.isEditing || false;

  const { columns, rows } = generateEmptyGrid(3, 5);

  return (
    <>
      <div className={layoutStyles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={layoutStyles.title}>
          {isEditing ? 'Редактирование графика' : 'Добавление графика'}
        </h2>
      </div>
      <ChartBuilder
        initialColumns={isEditing ? undefined : columns}
        initialRows={isEditing ? undefined : rows}
      />
    </>
  );
}

export default ChartBuilderPage;
