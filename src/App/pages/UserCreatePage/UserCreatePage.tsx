import PageTitle from 'components/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';

function UserCreatePage() {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle title="Добавить пользователя" onNavigate={navigate} />
    </>
  );
}

export default UserCreatePage;
