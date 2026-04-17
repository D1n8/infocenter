import LogoIcon from 'components/Icons/Logo';
import styles from './Header.module.scss'
import BellIcon from 'components/Icons/Bell';
import UserIcon from 'components/Icons/User';

function Header() {
    return ( 
        <header className={styles.header}>
            <LogoIcon/>
            <nav className={styles.nav}>
                <BellIcon/>
                <UserIcon/>
            </nav>
        </header>
     );
}

export default Header;