import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle/PageTitle';
import PermissionsTree from 'components/PermissionsTree/PermissionsTree';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import type { CreateUserType } from 'store/models/user';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { PermissionGrantType } from 'types/index';

import styles from './UserCreatePage.module.scss';
import UserDataInput from './components/UserDataInput';

const UserCreatePage = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useRootStore();

  const [data, setData] = useState<CreateUserType>({
    login: '',
    email: '',
    full_name: '',
    role: 'user',
    job_title: '',
    is_active: true,
    password: '12345',
  });

  const [permissions, setPermissions] = useState<PermissionGrantType[]>([]);

  useEffect(() => {
    userStore.fetchUnitsTree();
  }, [userStore]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newUserId = await userStore.createUser(data);

    if (newUserId) {
      if (permissions.length > 0) {
        await userStore.grantPermissions(newUserId, { permissions });
      }
      navigate(routes.adminUsersList.create());
    }
  }

  return (
    <>
      <PageTitle title="Добавить пользователя" onNavigate={navigate} />

      <div className={layoutStyles.settingsContainer}>
        <Input className={layoutStyles.settingsInput} icon={<Search />} placeholder="Поиск" />

        <form
          className={classNames(styles.form, layoutStyles.settingsMenu)}
          onSubmit={handleSubmit}
        >
          <h3>Основные данные</h3>
          <div className={styles.formInputs}>
            <UserDataInput
              title="ФИО"
              value={data.full_name}
              onChange={(e) => setData({ ...data, full_name: e.target.value })}
            />
            <UserDataInput
              title="Логин"
              value={data.login}
              onChange={(e) => setData({ ...data, login: e.target.value })}
            />
            <UserDataInput
              title="Должность"
              value={data.job_title}
              onChange={(e) => setData({ ...data, job_title: e.target.value })}
            />
            <UserDataInput
              title="Почта"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div className={styles.permissions}>
            <h3 className={styles.permissionsTitle}>Настройка прав доступа</h3>
            <PermissionsTree
              tree={userStore.unitsTree}
              selectedPermissions={permissions}
              onChange={setPermissions}
            />
          </div>

          <div className={styles.btnContainer}>
            <Button type="submit" disabled={userStore.isLoading}>
              {userStore.isLoading ? 'Создание...' : 'Создать пользователя'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
});

export default UserCreatePage;
