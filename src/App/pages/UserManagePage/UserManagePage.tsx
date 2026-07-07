import classNames from 'classnames';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import PageTitle from 'components/PageTitle/PageTitle';
import PermissionsTree from 'components/PermissionsTree/PermissionsTree';
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

const ROLE_OPTIONS = [
  { value: 'user', label: 'Пользователь' },
  { value: 'admin', label: 'Администратор' },
];

const UserManagePage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: '',
    email: '',
    fullName: '',
    jobTitle: '',
    role: 'user',
  });

  const [selectedPermissions, setSelectedPermissions] = useState<PermissionGrantType[]>([]);
  const [docPermission, setDocPermission] = useState(false);

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
        role: userStore.managedUser.role,
      });
    }
    if (userStore.managedPermissions) {
      setSelectedPermissions(getFlatPermissions(userStore.managedPermissions));
    }
    setDocPermission(userStore.managedDocPermission);
  }, [userStore.managedUser, userStore.managedPermissions, userStore.managedDocPermission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !userStore.managedPermissions) return;

    const originalPermissions = getFlatPermissions(userStore.managedPermissions);

    const promises: Promise<unknown>[] = [
      userStore.updateUser(id, {
        login: formData.login,
        email: formData.email,
        full_name: formData.fullName,
        job_title: formData.jobTitle,
        role: formData.role as 'user' | 'admin',
      }),
    ];

    if (formData.role === 'admin') {
      if (originalPermissions.length > 0) {
        promises.push(userStore.revokePermissions(id, { permissions: originalPermissions }));
      }
      if (userStore.managedDocPermission) {
        promises.push(userStore.setDocumentPermission(id, false));
      }
    } else {
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

      if (toGrant.length > 0) {
        promises.push(userStore.grantPermissions(id, { permissions: toGrant }));
      }

      if (toRevoke.length > 0) {
        promises.push(userStore.revokePermissions(id, { permissions: toRevoke }));
      }

      if (docPermission !== userStore.managedDocPermission) {
        promises.push(userStore.setDocumentPermission(id, docPermission));
      }
    }

    await Promise.all(promises);
    navigate(routes.adminUsersList.create());
  };

  if (userStore.isLoading && !userStore.managedUser) {
    return <div className={layoutStyles.settingsContainer}>Загрузка данных...</div>;
  }

  const isAdmin = formData.role === 'admin';

  return (
    <>
      <PageTitle title="Редактирование пользователя" />

      <div className={layoutStyles.settingsContainer}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#595959' }}>Роль в системе</span>
              <Dropdown
                id="role-select"
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={(opt) => setFormData({ ...formData, role: String(opt.value) })}
              />
            </div>
          </div>

          <div className={styles.permissions}>
            <h3 className={styles.permissionsTitle}>Настройка прав доступа</h3>

            {isAdmin ? (
              <div
                style={{
                  padding: '24px',
                  background: '#f6ffed',
                  border: '1px solid #91d5ff',
                  borderRadius: '8px',
                  color: '#096dd9',
                }}
              >
                Администратор имеет полный доступ ко всем функциям и подразделениям системы.
              </div>
            ) : (
              <>
                <PermissionsTree
                  tree={userStore.unitsTree}
                  selectedPermissions={selectedPermissions}
                  onChange={setSelectedPermissions}
                />

                <div
                  style={{
                    marginBottom: '24px',
                    padding: '16px',
                    background: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    marginTop: '16px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={docPermission}
                      onChange={(e) => setDocPermission(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Разрешить загрузку и удаление документов
                  </label>
                </div>
              </>
            )}
          </div>

          <div className={layoutStyles.bottomContainer}>
            <div className={layoutStyles.btnContainer}>
              <Button type="button" className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
                Отменить
              </Button>
              <Button type="submit" disabled={userStore.isLoading}>
                {userStore.isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
});

export default UserManagePage;
