import classNames from 'classnames';
import PageTitle from 'components/PageTitle';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useRootStore } from 'store/RootStore/RootStore';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './SettingsPage.module.scss';
import SettingsItem from './components/SettingsItem';

const SettingsPage = observer(() => {
  const { userStore } = useRootStore();

  return (
    <div>
      <PageTitle title="Настройки" />
      <div className={layoutStyles.settingsContainer}>
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
