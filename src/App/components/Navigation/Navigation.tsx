import styles from './Navigation.module.scss'

function Navigation() {
    return ( 
        <nav>
            <ul className={styles.nav}>
                <li className={styles.navItem}>Организационные документы</li>
                <li className={styles.navItem}>Стратегия</li>
                <li className={styles.navItem}>Оперативное управление</li>
                <li className={styles.navItem}>Проектное управление</li>
                <li className={styles.navItem}>Управление проблемами</li>
            </ul>
        </nav>
     );
}

export default Navigation;