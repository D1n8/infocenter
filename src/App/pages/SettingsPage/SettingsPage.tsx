import classNames from 'classnames';
import PageTitle from 'components/PageTitle/PageTitle';
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
          {userStore.canManagePermissions && (
            <>
              <SettingsItem href={routes.adminUsersList.create()}>
                Управление пользователями
              </SettingsItem>
              <SettingsItem href={routes.adminUnitsManage.create()}>
                Предприятия и структура
              </SettingsItem>
            </>
          )}
        </section>
      </div>
    </div>
  );
});

export default SettingsPage;
