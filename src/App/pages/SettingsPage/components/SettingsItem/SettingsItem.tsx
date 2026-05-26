import Chevron from 'components/Icons/Chevron';
import { Link } from 'react-router-dom';

import styles from './SettingsItem.module.scss';

type SettingsPageType = {
  children: React.ReactNode;
};

function SettingsItem({ children }: SettingsPageType) {
  return (
    <Link className={styles.settingsItem} to={'#'}>
      <span className={styles.text}>{children}</span>
      <Chevron />
    </Link>
  );
}

export default SettingsItem;
