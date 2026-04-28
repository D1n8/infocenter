import Navigation from '../../components/Navigation';
import OperationalManagement from '../OperationalManagement';

import styles from './Main.module.scss';

function Main() {
  return (
    <>
      <Navigation />

      <div className={styles.main}>
        <OperationalManagement />
      </div>
    </>
  );
}

export default Main;
