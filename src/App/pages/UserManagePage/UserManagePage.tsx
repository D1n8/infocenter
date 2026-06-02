import classNames from 'classnames';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle/PageTitle';
import PermissionsTree from 'components/PermissionsTree/PermissionsTree';
import SaveButtons from 'components/SaveButtons';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { PermissionGrantType, PermissionType } from 'types/index';

import styles from '../UserCreatePage/UserCreatePage.module.scss';
import UserDataInput from '../UserCreatePage/components/UserDataInput';

function getFlatPermissions(apiPermissions: PermissionType[] | null): PermissionGrantType[] {
  if (!apiPermissions) return [];
  return apiPermissions.map((p) => ({
    unit_id: p.unit.id,
    block: p.block,
    action: p.action,
  }));
}

const UserManagePage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: '',
    email: '',
    fullName: '',
    jobTitle: '',
  });

  const [selectedPermissions, setSelectedPermissions] = useState<PermissionGrantType[]>([]);

  useEffect(() => {
    if (id) {
      userStore.fetchUserData(id);
      userStore.fetchUnitsTree();
    }

    return () => {
      userStore.resetManagedUser();
    };
  }, [id, userStore]);

  useEffect(() => {
    if (userStore.managedUser) {
      setFormData({
        login: userStore.managedUser.login,
        email: userStore.managedUser.email,
        fullName: userStore.managedUser.fullName,
        jobTitle: userStore.managedUser.jobTitle,
      });
    }
    if (userStore.managedPermissions) {
      setSelectedPermissions(getFlatPermissions(userStore.managedPermissions));
    }
  }, [userStore.managedUser, userStore.managedPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !userStore.managedPermissions) return;

    const originalPermissions = getFlatPermissions(userStore.managedPermissions);

    const toGrant = selectedPermissions.filter(
      (selected) =>
        !originalPermissions.some(
          (orig) =>
            orig.unit_id === selected.unit_id &&
            orig.block === selected.block &&
            orig.action === selected.action
        )
    );

    const toRevoke = originalPermissions.filter(
      (orig) =>
        !selectedPermissions.some(
          (selected) =>
            selected.unit_id === orig.unit_id &&
            selected.block === orig.block &&
            selected.action === orig.action
        )
    );

    const promises: Promise<void | null>[] = [
      userStore.updateUser(id, {
        login: formData.login,
        email: formData.email,
        full_name: formData.fullName,
        job_title: formData.jobTitle,
      }),
    ];

    if (toGrant.length > 0) {
      promises.push(userStore.grantPermissions(id, { permissions: toGrant }));
    }

    if (toRevoke.length > 0) {
      promises.push(userStore.revokePermissions(id, { permissions: toRevoke }));
    }

    await Promise.all(promises);
    navigate(routes.adminUsersList.create());
  };

  if (userStore.isLoading && !userStore.managedUser) {
    return <div className={layoutStyles.settingsContainer}>Загрузка данных...</div>;
  }

  return (
    <>
      <PageTitle title="Редактирование пользователя" onNavigate={navigate} />

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
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <UserDataInput
              title="Логин"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            />
            <UserDataInput
              title="Должность"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
            <UserDataInput
              title="Почта"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className={styles.permissions}>
            <h3 className={styles.permissionsTitle}>Настройка прав доступа</h3>
            <PermissionsTree
              tree={userStore.unitsTree}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </div>

          <SaveButtons isLoading={userStore.isLoading} onNavigate={navigate} isSubmitType={true} />
        </form>
      </div>
    </>
  );
});

export default UserManagePage;
