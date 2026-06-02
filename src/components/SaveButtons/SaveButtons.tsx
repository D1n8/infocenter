import Button from 'components/Button';
import type { NavigateFunction } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

type SaveButtonsType = {
  isLoading: boolean;
  onNavigate: NavigateFunction;
  handleSave?: () => void;
  isSubmitType?: boolean;
};

function SaveButtons({ isLoading, onNavigate, isSubmitType = false, handleSave }: SaveButtonsType) {
  return (
    <div className={layoutStyles.bottomContainer}>
      <div className={layoutStyles.btnContainer}>
        <Button className={layoutStyles.cancelBtn} onClick={() => onNavigate(-1)}>
          Отменить
        </Button>
        {isSubmitType ? (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        ) : (
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default SaveButtons;
