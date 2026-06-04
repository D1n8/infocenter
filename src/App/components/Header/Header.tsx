import LogoIcon from 'components/Icons/Logo';
import Settings from 'components/Icons/SettingsIcon';
import UserIcon from 'components/Icons/User';
import { routes } from 'config/routes';
import { Link } from 'react-router';

import styles from './Header.module.scss';
import { NotificationBell } from './components/NotificationBell';

function Header() {
  return (
    <header className={styles.header}>
      <Link to={routes.main.create()}>
        <LogoIcon />
      </Link>
      <nav className={styles.nav}>
        <NotificationBell />
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
