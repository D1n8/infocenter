import App from 'App/index';
import AuthPage from 'App/pages/Auth';
import ChartBuilderPage from 'App/pages/ChartBuilderPage';
import ChartListSettings from 'App/pages/ChartListSettings';
import Main from 'App/pages/Main';
import OperationalManagement from 'App/pages/OperationalManagement';
import Profile from 'App/pages/Profile';
import SettingsLayout from 'App/pages/SettingsPage/SettingsLayout';
import SettingsPage from 'App/pages/SettingsPage/SettingsPage';
import UserCreatePage from 'App/pages/UserCreatePage';
import UserManagePage from 'App/pages/UserManagePage';
import UsersListPage from 'App/pages/UsersListPage';
import { RequireAuth, RequireGuest } from 'components/Router/ProtectedRoute';
import { Navigate, type RouteObject } from 'react-router-dom';

import { routes } from './routes';

export const routesConfig: RouteObject[] = [
  {
    element: <RequireAuth />,
    children: [
      {
        path: routes.main.mask,
        element: <App />,
        children: [
          {
            path: routes.settings.mask,
            element: <SettingsLayout />,
            children: [
              {
                index: true,
                element: <SettingsPage />,
              },
              {
                path: routes.adminUsersList.mask,
                element: <UsersListPage />,
              },
              {
                path: routes.adminUserManage.mask,
                element: <UserManagePage />,
              },
              {
                path: routes.adminCreateUser.mask,
                element: <UserCreatePage />,
              },
            ],
          },
          {
            path: routes.profile.mask,
            element: <Profile />,
          },
          {
            element: <Main />,
            children: [
              {
                index: true,
                element: <Navigate to={routes.operationalManagement.create()} replace />,
              },
              {
                path: routes.operationalManagement.mask,
                element: <OperationalManagement />,
              },
              {
                path: routes.chartListSettings.mask,
                element: <ChartListSettings />,
              },
              {
                path: routes.chartBuilder.mask,
                element: <ChartBuilderPage />,
              },
            ],
          },
          {
            path: '*',
            element: <Navigate to={routes.operationalManagement.create()} replace />,
          },
        ],
      },
    ],
  },
  {
    element: <RequireGuest />,
    children: [
      {
        path: routes.auth.mask,
        element: <AuthPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={routes.auth.create()} replace />,
  },
];
