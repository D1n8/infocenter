import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';

import styles from './Profile.module.scss';

function Profile() {
  const { userStore } = useRootStore();
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={styles.title}>Профиль</h2>
        <p>{userStore.user?.fullName}</p>
      </div>
    </div>
  );
}

export default Profile;
