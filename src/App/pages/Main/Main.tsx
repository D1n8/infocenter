import Navigation from 'App/components/Navigation';
import { Outlet } from 'react-router-dom';

import styles from './Main.module.scss';

function Main() {
  return (
    <>
      <Navigation />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </>
  );
}

export default Main;
