import Button from 'components/Button';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

const Profile = observer(() => {
  const { userStore } = useRootStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const user = userStore.user;

  if (!user) {
    return null;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword) {
      setMessage({ text: 'Заполните оба поля', type: 'error' });
      return;
    }

    const successMessage = await userStore.changePassword(currentPassword, newPassword);

    if (successMessage) {
      setMessage({ text: successMessage, type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setMessage({ text: userStore.error, type: 'error' });
    }
  };

  return (
    <>
      <PageTitle title="Профиль" />

      <div className={layoutStyles.settingsContainer}>
        <div
          className={layoutStyles.settingsMenu}
          style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8c8c8c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                ФИО
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                {user.fullName}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8c8c8c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Логин
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                {user.login}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8c8c8c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Должность
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                {user.jobTitle}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8c8c8c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Электронная почта
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                {user.email}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8c8c8c',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Роль в системе
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}
          >
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 500 }}>
              Изменить пароль
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}
            >
              <div>
                <label
                  style={{
                    fontSize: '13px',
                    color: '#8c8c8c',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Текущий пароль
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '13px',
                    color: '#8c8c8c',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Новый пароль
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                />
              </div>

              {message && (
                <div
                  style={{
                    color: message.type === 'success' ? '#52c41a' : '#ff4d4f',
                    fontSize: '14px',
                  }}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={userStore.isLoading}
                style={{ alignSelf: 'flex-start' }}
              >
                {userStore.isLoading ? 'Сохранение...' : 'Обновить пароль'}
              </Button>
            </div>
          </form>

          <Button
            onClick={() => userStore.logout()}
            style={{
              marginTop: '12px',
              alignSelf: 'flex-start',
              backgroundColor: '#ff4d4f',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </>
  );
});

export default Profile;
