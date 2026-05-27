import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle/PageTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';
import type { CreateUserType } from 'store/models/user';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './UserCreatePage.module.scss';
import UserDataInput from './components/UserDataInput';

function UserCreatePage() {
  const navigate = useNavigate();
  const { userStore } = useRootStore();
  const [data, setData] = useState<CreateUserType>({
    login: '',
    email: '',
    full_name: '',
    role: 'inspector',
    job_title: '',
    is_active: true,
    password: '12345',
  });

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    userStore.createUser(data);
  }

  return (
    <>
      <PageTitle title="Добавить пользователя" onNavigate={navigate} />

      <div className={layoutStyles.settingsContainer}>
        <Input className={layoutStyles.settingsInput} icon={<Search />} placeholder="Поиск" />

        <form
          className={classNames(styles.form, layoutStyles.settingsMenu)}
          onSubmit={handleSubmit}
        >
          <h3>Основные данные</h3>
          <UserDataInput
            title="ФИО"
            value={data.full_name}
            onChange={(e) => setData({ ...data, full_name: e.target.value })}
          />
          <UserDataInput
            title="Логин"
            value={data.login}
            onChange={(e) => setData({ ...data, login: e.target.value })}
          />
          <UserDataInput
            title="Должность"
            value={data.job_title}
            onChange={(e) => setData({ ...data, job_title: e.target.value })}
          />
          <UserDataInput
            title="Почта"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <Button type="submit">Создать</Button>
        </form>
      </div>
    </>
  );
}

export default UserCreatePage;
