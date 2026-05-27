import Chevron from 'components/Icons/Chevron';
import { Link } from 'react-router-dom';

import styles from './UserItem.module.scss';

type UserPageType = {
  children: React.ReactNode;
  href?: string;
};

function UserItem({ children, href = '#' }: UserPageType) {
  return (
    <Link className={styles.userItem} to={href}>
      <span className={styles.text}>{children}</span>
      <Chevron />
    </Link>
  );
}

export default UserItem;
