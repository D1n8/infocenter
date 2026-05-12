import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';

import Navigation from '../App/components/Navigation';

import styles from './App.module.scss';
import Header from './components/Header';

const App = observer(() => {
  return (
    <div className={styles.app}>
      <Header />
      <Navigation />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
});

export default App;
