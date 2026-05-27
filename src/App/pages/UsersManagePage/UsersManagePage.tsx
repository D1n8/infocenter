import Button from 'components/Button';
import BackButton from 'components/IconButtons/BackButton';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import { useNavigate } from 'react-router-dom';

import styles from './UsersManagePage.module.scss';

function UserManagePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={styles.title}>Управление пользователями</h2>
      </div>
      <div className={styles.usersContainer}>
        <div className={styles.topContainer}>
          <Input icon={<Search />} placeholder="Поиск" />
          <Button>Добавить пользователя</Button>
        </div>
        <section className={styles.usersList}>asdf</section>
      </div>
    </div>
  );
}

export default UserManagePage;
