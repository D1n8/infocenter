import classNames from 'classnames';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './SettingsPage.module.scss';
import SettingsItem from './components/SettingsItem';

const SettingsPage = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useRootStore();

  return (
    <div>
      <PageTitle title="Настройки" onNavigate={navigate} />
      <div className={layoutStyles.settingsContainer}>
        <Input
          icon={<Search />}
          placeholder="Поиск настроек"
          className={layoutStyles.settingsInput}
        />

        <section className={classNames(styles.settingsList, layoutStyles.settingsMenu)}>
          <SettingsItem>Пользовательские настройки</SettingsItem>
          <SettingsItem>Предприятия</SettingsItem>

          {userStore.canManagePermissions && (
            <SettingsItem href={routes.adminUsersList.create()}>
              Управление пользователями
            </SettingsItem>
          )}

          {/* <SettingsItem>Управление ролями</SettingsItem> */}
          <SettingsItem>Системные настройки</SettingsItem>
        </section>
      </div>
    </div>
  );
});

export default SettingsPage;
