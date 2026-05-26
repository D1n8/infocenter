import BackButton from 'components/IconButtons/BackButton';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import { useNavigate } from 'react-router-dom';

import styles from './SettingsPage.module.scss';
import SettingsItem from './components/SettingsItem';

function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.titleContainer}>
        <BackButton onClick={() => navigate(-1)} />
        <h2 className={styles.title}>Настройки</h2>
      </div>
      <div className={styles.settingsContainer}>
        <Input icon={<Search />} placeholder="Поиск настроек" />

        <section className={styles.settingsList}>
          <SettingsItem>Пользовательские настройки</SettingsItem>
          <SettingsItem>Предприятия</SettingsItem>
          <SettingsItem>Управление пользователями</SettingsItem>
          <SettingsItem>Управление ролями</SettingsItem>
          <SettingsItem>Системные настройки</SettingsItem>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
