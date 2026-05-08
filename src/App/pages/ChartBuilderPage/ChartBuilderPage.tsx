import ChartBuilder from 'App/components/ChartBuilder';
import { generateEmptyGrid } from 'App/utils/generateEmptyGrid';
import Button from 'components/Button';
import { useNavigate } from 'react-router';

function ChartBuilerPage() {
  const navigate = useNavigate();
  const { columns, rows } = generateEmptyGrid(6, 10);
  return (
    <div>
      <Button onClick={() => navigate(-1)}>Назад</Button>
      <ChartBuilder initialColumns={columns} initialRows={rows} />
    </div>
  );
}

export default ChartBuilerPage;
