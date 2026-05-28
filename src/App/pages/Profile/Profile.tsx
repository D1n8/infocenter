import PageTitle from 'components/PageTitle';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

const Profile = observer(() => {
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  const user = userStore.user;

  if (!user) {
    return null;
  }

  return (
    <>
      <PageTitle title="Профиль" onNavigate={navigate} />

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
        </div>
      </div>
    </>
  );
});

export default Profile;
