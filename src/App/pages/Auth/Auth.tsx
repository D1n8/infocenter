import Button from 'components/Button';
import LogoIcon from 'components/Icons/Logo';
import Input from 'components/Input';
import { useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';

import styles from './Auth.module.scss';
import img from './assets/Image.png';

function AuthPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { userStore } = useRootStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userStore.loginUser(login, password);
  };

  return (
    <main className={styles.authMain}>
      <section className={styles.formSection}>
        <div className={styles.auth}>
          <div className={styles.logoBg}>
            <LogoIcon width={100} height={100} />
          </div>
          <form className={styles.authForm} onSubmit={handleSubmit}>
            <Input
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className={styles.authBtn} type="submit">
              Войти
            </Button>
          </form>
        </div>
      </section>
      <section className={styles.bgSection}>
        <img className={styles.img} src={img} />
      </section>
    </main>
  );
}

export default AuthPage;
