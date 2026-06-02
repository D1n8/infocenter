import { routes } from 'config/routes';
import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';
import { useRootStore } from 'store/RootStore/RootStore';

export const RequireAuth = observer(() => {
  const { userStore } = useRootStore();

  if (!userStore.isAuth) {
    return <Navigate to={routes.auth.mask} replace />;
  }

  return <Outlet />;
});

export const RequireGuest = observer(() => {
  const { userStore } = useRootStore();

  if (userStore.isAuth) {
    return <Navigate to={routes.main.create()} replace />;
  }

  return <Outlet />;
});
