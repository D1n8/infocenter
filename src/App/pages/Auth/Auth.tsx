import Button from 'components/Button';
import LogoIcon from 'components/Icons/Logo';
import Input from 'components/Input';

import styles from './Auth.module.scss';
import img from './assets/Image.png';

function AuthPage() {
  return (
    <main className={styles.authMain}>
      <section className={styles.formSection}>
        <div className={styles.auth}>
          <div className={styles.logoBg}>
            <LogoIcon width={171} height={43} />
          </div>
          <form className={styles.authForm}>
            <Input placeholder="Введите логин" />
            <Input placeholder="Введите пароль" />
            <Button className={styles.authBtn}>Войти</Button>
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
