import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

type PageTitleType = {
  title: string;
};

function PageTitle({ title }: PageTitleType) {
  const navigate = useNavigate();

  return (
    <div className={layoutStyles.titleContainer}>
      <BackButton onClick={() => navigate(-1)} />
      <h2 className={layoutStyles.title}>{title}</h2>
    </div>
  );
}

export default PageTitle;
