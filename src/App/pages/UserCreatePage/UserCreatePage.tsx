import classNames from 'classnames';
import Button from 'components/Button';
import PageTitle from 'components/PageTitle/PageTitle';
import PermissionsTree from 'components/PermissionsTree/PermissionsTree';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import type { UserType } from 'store/models/user';
import layoutStyles from 'styles/shared/Layout.module.scss';
import type { PermissionGrantType } from 'types/index';

import styles from './UserCreatePage.module.scss';
import UserDataInput from './components/UserDataInput';

const UserCreatePage = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useRootStore();

  const [data, setData] = useState<UserType>({
    login: '',
    email: '',
    full_name: '',
    role: 'user',
    job_title: '',
    is_active: true,
  });

  const [permissions, setPermissions] = useState<PermissionGrantType[]>([]);

  // Стейты для ошибок
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    userStore.fetchUnitsTree();
  }, [userStore]);

  // Локальная валидация перед отправкой
  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!data.full_name.trim()) {
      newErrors.full_name = 'Введите ФИО';
      isValid = false;
    }
    if (!data.login.trim()) {
      newErrors.login = 'Введите логин';
      isValid = false;
    }
    if (!data.job_title.trim()) {
      newErrors.job_title = 'Введите должность';
      isValid = false;
    }
    if (!data.email.trim()) {
      newErrors.email = 'Введите почту';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Некорректный формат почты';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Очистка ошибки при вводе
  const handleChange = (field: keyof UserType, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      const newUserId = await userStore.createUser(data);

      if (newUserId) {
        if (data.role === 'user' && permissions.length > 0) {
          await userStore.grantPermissions(newUserId, { permissions });
        }
        navigate(routes.adminUsersList.create());
      } else {
        // Если метод вернул null, но не выкинул ошибку (зависит от вашей реализации стора)
        setServerError(userStore.error || 'Не удалось создать пользователя');
      }
    } catch (error: any) {
      // Перехватываем ошибку от API (Axios)
      const detail = error.response?.data?.detail;

      if (detail === 'Email already registered') {
        setServerError('Пользователь с такой почтой уже существует');
      } else if (typeof detail === 'string') {
        setServerError(detail); // Выводим текст ошибки от бэкенда
      } else {
        setServerError('Произошла ошибка при создании пользователя');
      }
    }
  }

  return (
    <>
      <PageTitle title="Добавить пользователя" />

      <div className={layoutStyles.settingsContainer}>
        <form
          className={classNames(styles.form, layoutStyles.settingsMenu)}
          onSubmit={handleSubmit}
        >
          <h3>Основные данные</h3>
          <div className={styles.formInputs}>
            <div className={styles.inputWrapper}>
              <UserDataInput
                title="ФИО"
                value={data.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
              />
              {errors.full_name && <span className={styles.errorText}>{errors.full_name}</span>}
            </div>

            <div className={styles.inputWrapper}>
              <UserDataInput
                title="Логин"
                value={data.login}
                onChange={(e) => handleChange('login', e.target.value)}
              />
              {errors.login && <span className={styles.errorText}>{errors.login}</span>}
            </div>

            <div className={styles.inputWrapper}>
              <UserDataInput
                title="Должность"
                value={data.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
              />
              {errors.job_title && <span className={styles.errorText}>{errors.job_title}</span>}
            </div>

            <div className={styles.inputWrapper}>
              <UserDataInput
                title="Почта"
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.roleSection}>
            <h3 className={styles.roleTitle}>Роль в системе</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={data.role === 'user'}
                  onChange={() => handleChange('role', 'user')}
                />
                Пользователь
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={data.role === 'admin'}
                  onChange={() => handleChange('role', 'admin')}
                />
                Администратор
              </label>
            </div>
          </div>

          {data.role === 'user' && (
            <div className={styles.permissions}>
              <h3 className={styles.permissionsTitle}>Настройка прав доступа</h3>
              <PermissionsTree
                tree={userStore.unitsTree}
                selectedPermissions={permissions}
                onChange={setPermissions}
              />
            </div>
          )}

          {/* Плашка с серверной ошибкой */}
          <div className={styles.serverErrorWrapper}>
            {serverError && <div className={styles.serverError}>{serverError}</div>}
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
