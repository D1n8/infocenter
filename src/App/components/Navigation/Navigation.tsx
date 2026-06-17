import classNames from 'classnames';
import { routes } from 'config/routes';
import { NavLink } from 'react-router-dom';

import styles from './Navigation.module.scss';

function Navigation() {
  return (
    <nav>
      <ul className={styles.nav}>
        <li>
          <NavLink
            to={routes.organizationaDocuments.create()}
            className={({ isActive }) => classNames(styles.navItem, isActive && styles.isSelected)}
          >
            Организационные документы
          </NavLink>
        </li>
        <li className={styles.navItem}>Стратегия</li>
        <li>
          <NavLink
            to={routes.operationalManagement.create()}
            className={({ isActive }) => classNames(styles.navItem, isActive && styles.isSelected)}
          >
            Оперативное управление
          </NavLink>
        </li>
        <li className={styles.navItem}>Проектное управление</li>
        <li className={styles.navItem}>Управление проблемами</li>
      </ul>
    </nav>
  );
}

export default Navigation;
