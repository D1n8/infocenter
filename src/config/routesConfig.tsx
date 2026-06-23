import App from 'App/index';
import AuthPage from 'App/pages/Auth';
import BlockPage from 'App/pages/BlockPage';
import ChartBuilderPage from 'App/pages/ChartBuilderPage';
import ChartListSettings from 'App/pages/ChartListSettings';
import ChartsComparisonPage from 'App/pages/ChartsComparisonPage';
import DashboardMenu from 'App/pages/DashboardMenu/DashboardMenu'; // ИМПОРТ НОВОГО МЕНЮ
import OrganizationalDocuments from 'App/pages/OrganizationalDocuments';
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
          // Редирект с корня на дашборд
          {
            index: true,
            element: <Navigate to={routes.operationalManagement.create()} replace />,
          },
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
            path: routes.organizationaDocuments.mask,
            element: <OrganizationalDocuments />,
          },

          // ==========================================
          // ИЗМЕНЕНИЕ ЗДЕСЬ: Теперь по этому пути открывается меню из 5 плиток
          {
            path: routes.operationalManagement.mask,
            element: <DashboardMenu />,
          },
          // ==========================================

          {
            path: routes.dashboardBlock.mask,
            element: <BlockPage />,
          },
          {
            path: routes.chartsComparison.mask,
            element: <ChartsComparisonPage />,
          },
          {
            path: routes.chartListSettings.mask,
            element: <ChartListSettings />,
          },
          {
            path: routes.chartBuilder.mask,
            element: <ChartBuilderPage />,
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
