import BellIcon from 'components/Icons/Bell';
import LogoIcon from 'components/Icons/Logo';
import Settings from 'components/Icons/SettingsIcon';
import UserIcon from 'components/Icons/User';
import { routes } from 'config/routes';
import { Link } from 'react-router';

import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <LogoIcon />
      <nav className={styles.nav}>
        <BellIcon />
        <Link to={routes.settings.create()}>
          <Settings />
        </Link>
        <Link to={routes.profile.create()}>
          <UserIcon />
        </Link>
      </nav>
    </header>
  );
}

export default Header;
