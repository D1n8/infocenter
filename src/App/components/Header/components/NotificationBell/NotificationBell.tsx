import { formatDate } from 'App/utils/formatDate';
import BellIcon from 'components/Icons/Bell';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';

import styles from './NotificationBell.module.scss';

export const NotificationBell = observer(() => {
  const { notificationStore } = useRootStore();

  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      notificationStore.resetUnreadCount();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, notificationStore]);

  return (
    <div className={styles.bellContainer} ref={bellRef}>
      <button className={styles.bellBtn} onClick={() => setIsOpen(!isOpen)}>
        <BellIcon />
        {notificationStore.unreadCount > 0 && (
          <span className={styles.badge}>{notificationStore.unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>Уведомления</div>
          <ul className={styles.list}>
            {notificationStore.notifications.length > 0 ? (
              notificationStore.notifications.map((notif, index) => (
                <li key={`${notif.id}-${index}`} className={styles.item}>
                  <p className={styles.message}>{notif.message}</p>
                  <span className={styles.time}>{formatDate(notif.timestamp)}</span>
                </li>
              ))
            ) : (
              <li className={styles.empty}>Нет уведомлений</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
});
