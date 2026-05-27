import classNames from 'classnames';
import BackButton from 'components/IconButtons/BackButton';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import { routes } from 'config/routes';
import { useNavigate } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './SettingsPage.module.scss';
import SettingsItem from './components/SettingsItem';

function SettingsPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className={layoutStyles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={layoutStyles.title}>Настройки</h2>
      </div>
      <div className={layoutStyles.settingsContainer}>
        <Input
          className={layoutStyles.settingsInput}
          icon={<Search />}
          placeholder="Поиск настроек"
        />

        <section className={classNames(styles.settingsList, layoutStyles.settingsMenu)}>
          <SettingsItem>Пользовательские настройки</SettingsItem>
          <SettingsItem>Предприятия</SettingsItem>
          <SettingsItem href={routes.adminUsersList.create()}>
            Управление пользователями
          </SettingsItem>
          <SettingsItem>Управление ролями</SettingsItem>
          <SettingsItem>Системные настройки</SettingsItem>
        </section>
      </div>
    </>
  );
}

export default SettingsPage;
