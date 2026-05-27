import PageTitle from 'components/PageTitle';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';

const UserManagePage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { userStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      userStore.fetchUserData(id);
    }

    return () => {
      userStore.resetManagedUser();
    };
  }, [id, userStore]);

  // if (userStore.isLoading) {
  //   return <div>Загрузка данных...</div>;
  // }

  return (
    <>
      <PageTitle title="Редактирование пользователя" onNavigate={navigate} />
      <h2>Управление пользователем: {userStore.managedUser?.fullName}</h2>
      <p>Email: {userStore.managedUser?.email}</p>
      <p>Должность: {userStore.managedUser?.jobTitle}</p>

      <h3>Доступные права:</h3>
      {userStore.managedPermissions?.map((p) => (
        <p key={p.id}>
          {p.id} - {p.block}
        </p>
      ))}
    </>
  );
});

export default UserManagePage;
