import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './UsersListPage.module.scss';
import UserItem from './components/UserItem';

const UsersListPage = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useRootStore();

  useEffect(() => {
    userStore.fetchUsersList();
  }, [userStore]);

  const usersList = userStore.usersList;

  return (
    <>
      <PageTitle title="Управление пользователями" onNavigate={navigate} />

      <div className={layoutStyles.settingsContainer}>
        <div className={styles.topContainer}>
          <Input className={layoutStyles.settingsInput} icon={<Search />} placeholder="Поиск" />
          <Button onClick={() => navigate(routes.adminCreateUser.create())}>
            Добавить пользователя
          </Button>
        </div>

        <section className={classNames(styles.usersList, layoutStyles.settingsMenu)}>
          {usersList.map((user) => (
            <UserItem
              key={user.id}
              fullName={user.fullName}
              job={user.jobTitle}
              href={routes.adminUserManage.create(user.id)}
            />
          ))}
        </section>

        {/* <div className={layoutStyles.bottomContainer}>
          <div className={layoutStyles.btnContainer}>
            <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
              Отменить
            </Button>
            <Button>Сохранить</Button>
          </div>
        </div> */}
      </div>
    </>
  );
});

export default UsersListPage;
