import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './UsersListPage.module.scss';
import UserItem from './components/UserItem';

const UsersListPage = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useRootStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    userStore.fetchUsersList();
  }, [userStore]);

  const usersList = userStore.usersList;

  const filteredUsers = usersList.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchName = user.fullName?.toLowerCase().includes(query);
    const matchJob = user.jobTitle?.toLowerCase().includes(query);

    return matchName || matchJob;
  });

  return (
    <>
      <PageTitle title="Управление пользователями" />

      <div className={layoutStyles.settingsContainer}>
        <div className={styles.topContainer}>
          <Input
            className={layoutStyles.settingsInput}
            icon={<Search />}
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => navigate(routes.adminCreateUser.create())}>
            Добавить пользователя
          </Button>
        </div>

        <section className={classNames(styles.usersList, layoutStyles.settingsMenu)}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserItem
                key={user.id}
                fullName={user.fullName}
                job={user.jobTitle}
                href={routes.adminUserManage.create(user.id)}
              />
            ))
          ) : (
            <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
              Пользователи не найдены
            </div>
          )}
        </section>
      </div>
    </>
  );
});

export default UsersListPage;
