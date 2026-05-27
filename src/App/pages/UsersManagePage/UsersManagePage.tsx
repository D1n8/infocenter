import classNames from 'classnames';
import Button from 'components/Button';
import BackButton from 'components/IconButtons/BackButton';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import { useNavigate } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './UsersManagePage.module.scss';
import UserItem from './components/UserItem';

function UserManagePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={layoutStyles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={layoutStyles.title}>Управление пользователями</h2>
      </div>
      <div className={layoutStyles.settingsContainer}>
        <div className={styles.topContainer}>
          <Input className={layoutStyles.settingsInput} icon={<Search />} placeholder="Поиск" />
          <Button>Добавить пользователя</Button>
        </div>
        <section className={classNames(styles.usersList, layoutStyles.settingsMenu)}>
          <UserItem fullName={'Stepa Stepan dsa dsdasdasd'} job={'Главный технолог'} />
          <UserItem fullName={'Stepa Stepan'} job={'Главный технологdddddddddd'} />
          <UserItem fullName={'Stepa Stepan'} job={'Главный технолог'} />
          <UserItem fullName={'Stepa Stepan'} job={'Главный технолог'} />
        </section>
      </div>
    </div>
  );
}

export default UserManagePage;
