import BackButton from 'components/IconButtons/BackButton';
import type { NavigateFunction } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

type PageTitleType = {
  title: string;
  onNavigate: NavigateFunction;
};

function PageTitle({ onNavigate, title }: PageTitleType) {
  return (
    <div className={layoutStyles.titleContainer}>
      <BackButton onClick={() => onNavigate(-1)} />
      <h2 className={layoutStyles.title}>{title}</h2>
    </div>
  );
}

export default PageTitle;
