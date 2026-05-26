import Navigation from 'App/components/Navigation';
import { Outlet } from 'react-router-dom';

import styles from './OperationalManagement.module.scss';

function OpManLayout() {
  return (
    <>
      <Navigation />
      <div className={styles.operMan}>
        <Outlet />
      </div>
    </>
  );
}

export default OpManLayout;
