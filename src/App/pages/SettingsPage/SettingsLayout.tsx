import { Outlet } from 'react-router-dom';

import styles from './SettingsPage.module.scss';

function SettingsLayout() {
  return (
    <div className={styles.settingsLayout}>
      <Outlet />
    </div>
  );
}

export default SettingsLayout;
