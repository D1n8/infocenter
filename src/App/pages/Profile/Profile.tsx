import BackButton from 'components/IconButtons/BackButton';
import { useNavigate } from 'react-router-dom';

import styles from './Profile.module.scss';

function Profile() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={styles.title}>Профиль</h2>
      </div>
    </div>
  );
}

export default Profile;
