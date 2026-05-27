import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

function Profile() {
  const { userStore } = useRootStore();
  const navigate = useNavigate();
  return (
    <div className={layoutStyles.titleContainer}>
      <BackButton onClick={() => navigate(-1)} />
      <h2 className={layoutStyles.title}>Профиль</h2>
      <p>{userStore.user?.fullName}</p>
    </div>
  );
}

export default Profile;
