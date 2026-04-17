import Header from './components/Header'
import styles from './App.module.scss'
import { Outlet } from 'react-router'
import { observer } from 'mobx-react-lite'

const App = observer(() => {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
})

export default App