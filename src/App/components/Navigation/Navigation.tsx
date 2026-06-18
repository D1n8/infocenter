import classNames from 'classnames';
import { routes } from 'config/routes';
import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './Navigation.module.scss';

function Navigation() {
  const location = useLocation();
  const [isOpManDropdownOpen, setIsOpManDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpManDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpManDropdownOpen(false);
  }, [location.pathname]);

  const isOpManActive = location.pathname.includes(routes.operationalManagement.mask);

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

        <li className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            className={classNames(
              styles.navItem,
              styles.dropdownBtn,
              isOpManActive && styles.isSelected
            )}
            onClick={() => setIsOpManDropdownOpen(!isOpManDropdownOpen)}
          >
            Оперативное управление
          </button>

          {isOpManDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <NavLink
                to={routes.operationalManagement.create()}
                end
                className={({ isActive }) =>
                  classNames(styles.dropdownItem, isActive && styles.activeDropdownItem)
                }
              >
                Дашборд графиков
              </NavLink>
              <NavLink
                to={routes.chartsComparison.create()}
                className={({ isActive }) =>
                  classNames(styles.dropdownItem, isActive && styles.activeDropdownItem)
                }
              >
                Сравнение графиков
              </NavLink>
            </div>
          )}
        </li>

        <li className={styles.navItem}>Проектное управление</li>
        <li className={styles.navItem}>Управление проблемами</li>
      </ul>
    </nav>
  );
}

export default Navigation;
