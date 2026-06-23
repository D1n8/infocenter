import classNames from 'classnames';
import Settings from 'components/Icons/SettingsIcon';
import UserIcon from 'components/Icons/User';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import type { BlockType } from 'types/index';

import styles from './Header.module.scss';
import { NotificationBell } from './components/NotificationBell';

const BLOCKS: { id: BlockType; label: string }[] = [
  { id: 'safety', label: 'Безопасность' },
  { id: 'production', label: 'Производство' },
  { id: 'quality', label: 'Качество' },
  { id: 'economy', label: 'Экономика' },
  { id: 'culture', label: 'Корпоративная культура' },
];

const Header = observer(() => {
  const { userStore } = useRootStore();
  const location = useLocation();
  const [isOpManDropdownOpen, setIsOpManDropdownOpen] = useState(false);
  const [isDashboardHovered, setIsDashboardHovered] = useState(false);
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
    setIsDashboardHovered(false);
  }, [location.pathname]);

  const isOpManActive = location.pathname.includes('/operational-management');

  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.nav}>
          <li>
            <NavLink
              to={routes.organizationaDocuments.create()}
              className={({ isActive }) =>
                classNames(styles.navItem, isActive && styles.isSelected)
              }
            >
              Организационные документы
            </NavLink>
          </li>

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
                <div
                  className={styles.nestedDropdownContainer}
                  onMouseEnter={() => setIsDashboardHovered(true)}
                  onMouseLeave={() => setIsDashboardHovered(false)}
                >
                  <div className={classNames(styles.dropdownItem, styles.nestedTrigger)}>
                    Дашборд графиков
                  </div>

                  {isDashboardHovered && (
                    <div className={styles.nestedMenu}>
                      {BLOCKS.map(
                        (block) =>
                          userStore.hasBlockAccess(block.id) && (
                            <NavLink
                              key={block.id}
                              to={routes.dashboardBlock.create(block.id)}
                              className={({ isActive }) =>
                                classNames(
                                  styles.dropdownItem,
                                  isActive && styles.activeDropdownItem
                                )
                              }
                            >
                              {block.label}
                            </NavLink>
                          )
                      )}
                    </div>
                  )}
                </div>

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
        </ul>
      </nav>
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
});

export default Header;
