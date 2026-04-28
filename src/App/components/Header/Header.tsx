import BellIcon from 'components/Icons/Bell';
import LogoIcon from 'components/Icons/Logo';
import UserIcon from 'components/Icons/User';

import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <LogoIcon />
      <nav className={styles.nav}>
        <BellIcon />
        <UserIcon />
      </nav>
    </header>
  );
}

export default Header;
