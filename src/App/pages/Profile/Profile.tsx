import Button from 'components/Button';
import PageTitle from 'components/PageTitle';
import { observer } from 'mobx-react-lite';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

const Profile = observer(() => {
  const { userStore } = useRootStore();

  const user = userStore.user;

  if (!user) {
    return null;
  }

  return (
    <>
      <PageTitle title="Профиль" />

      <div className={layoutStyles.settingsContainer}>
        <div
          className={layoutStyles.settingsMenu}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}
        >
          <div>
            <span
              style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: '4px' }}
            >
              ФИО
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
              {user.fullName}
            </span>
          </div>

          <div>
            <span
              style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: '4px' }}
            >
              Логин
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
              {user.login}
            </span>
          </div>

          <div>
            <span
              style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: '4px' }}
            >
              Должность
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
              {user.jobTitle}
            </span>
          </div>

          <div>
            <span
              style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: '4px' }}
            >
              Электронная почта
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
              {user.email}
            </span>
          </div>

          <div>
            <span
              style={{ fontSize: '13px', color: '#8c8c8c', display: 'block', marginBottom: '4px' }}
            >
              Роль в системе
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
              {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>

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
