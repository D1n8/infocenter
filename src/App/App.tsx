import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';

import styles from './App.module.scss';
import Header from './components/Header';
import ScrollToTop from './components/Router/ScrollToTop';

const App = observer(() => {
  return (
    <div className={styles.app}>
      <ScrollToTop />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Header />
    </div>
  );
});

export default App;
