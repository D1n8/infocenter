import Button from 'components/Button';
import LogoIcon from 'components/Icons/Logo';
import Input from 'components/Input';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useRootStore } from 'store/RootStore/RootStore';

import styles from './Auth.module.scss';
import img from './assets/Image.png';

function AuthPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ login: '', password: '' });

  const { userStore } = useRootStore();

  const validate = () => {
    let isValid = true;
    const newErrors = { login: '', password: '' };

    if (!login.trim()) {
      newErrors.login = 'Введите логин';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    userStore.loginUser(login, password);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    if (errors.login) setErrors((prev) => ({ ...prev, login: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
  };

  return (
    <main className={styles.authMain}>
      <section className={styles.formSection}>
        <div className={styles.auth}>
          <div className={styles.logoBg}>
            <LogoIcon width={100} height={100} />
          </div>
          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <Input placeholder="Введите логин" value={login} onChange={handleLoginChange} />
              {errors.login && <span className={styles.errorText}>{errors.login}</span>}
            </div>

            <div className={styles.inputWrapper}>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <Button className={styles.authBtn} type="submit" disabled={userStore.isLoading}>
              {userStore.isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <div className={styles.serverErrorWrapper}>
              {userStore.error && <div className={styles.serverError}>{userStore.error}</div>}
            </div>
          </form>
        </div>
      </section>
      <section className={styles.bgSection}>
        <img className={styles.img} src={img} alt="Background" />
      </section>
    </main>
  );
}

export default observer(AuthPage);
