import Chevron from 'components/Icons/Chevron';
import { Link } from 'react-router-dom';

import styles from './UserItem.module.scss';

type UserPageType = {
  fullName: string;
  job?: string;
  href?: string;
};

function UserItem({ fullName, job, href = '#' }: UserPageType) {
  return (
    <Link className={styles.userItem} to={href}>
      <div className={styles.content}>
        <p className={styles.text}>{fullName}</p>
        <p className={styles.job}>{job}</p>
      </div>
      <Chevron />
    </Link>
  );
}

export default UserItem;
