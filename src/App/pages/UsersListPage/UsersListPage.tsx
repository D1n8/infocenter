import classNames from 'classnames';
import Button from 'components/Button';
import Search from 'components/Icons/Search';
import Input from 'components/Input';
import PageTitle from 'components/PageTitle';
import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import layoutStyles from 'styles/shared/Layout.module.scss';

import styles from './UsersListPage.module.scss';
import UserItem from './components/UserItem';

const UsersListPage = observer(() => {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle title="Управление пользователями" onNavigate={navigate} />

      <div className={layoutStyles.settingsContainer}>
        <div className={styles.topContainer}>
          <Input className={layoutStyles.settingsInput} icon={<Search />} placeholder="Поиск" />
          <Button onClick={() => navigate(routes.adminCreateUser.create())}>
            Добавить пользователя
          </Button>
        </div>

        <section className={classNames(styles.usersList, layoutStyles.settingsMenu)}>
          <UserItem
            fullName={'Stepa Stepan dsa dsdasdasd'}
            job={'Главный технолог'}
            href={routes.adminUserManage.create('1')}
          />
          <UserItem
            fullName={'Ivan Ivanov'}
            job={'Инженер'}
            href={routes.adminUserManage.create('2')}
          />
        </section>

        <div className={layoutStyles.bottomContainer}>
          <div className={layoutStyles.btnContainer}>
            <Button className={layoutStyles.cancelBtn} onClick={() => navigate(-1)}>
              Отменить
            </Button>
            <Button>Сохранить</Button>
          </div>
        </div>
      </div>
    </>
  );
});

export default UsersListPage;
