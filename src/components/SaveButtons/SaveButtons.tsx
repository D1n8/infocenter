import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

type SaveButtonsType = {
  isLoading: boolean;
  handleSave?: () => void;
  isSubmitType?: boolean;
};

function SaveButtons({ isLoading, isSubmitType = false, handleSave }: SaveButtonsType) {
  const navigate = useNavigate();

  return (
    <div className={layoutStyles.bottomContainer}>
      <div className={layoutStyles.btnContainer}>
        <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
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
