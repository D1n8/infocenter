import OperationalManagement from '../OperationalManagement';

import styles from './Main.module.scss';

function Main() {
  return (
    <>
      <div className={styles.main}>
        <OperationalManagement />
      </div>
    </>
  );
}

export default Main;
