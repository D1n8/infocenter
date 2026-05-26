import App from 'App/index';
import AuthPage from 'App/pages/Auth';
import ChartBuilderPage from 'App/pages/ChartBuilderPage';
import ChartListSettings from 'App/pages/ChartListSettings';
import Main from 'App/pages/Main';
import OperationalManagement from 'App/pages/OperationalManagement';
import SettingsPage from 'App/pages/SettingsPage/SettingsPage';
import { Navigate, type RouteObject } from 'react-router-dom';

import { routes } from './routes';

export const routesConfig: RouteObject[] = [
  {
    path: routes.main.mask,
    element: <App />,
    children: [
      {
        path: routes.settings.mask,
        element: <SettingsPage />,
      },
      {
        element: <Main />,
        children: [
          {
            index: true,
            element: <Navigate to={routes.operationalManagement.mask} replace />,
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
    ],
  },
  {
    path: routes.auth.mask,
    element: <AuthPage />,
  },
  {
    path: '*',
    element: <Navigate to={routes.main.mask} replace />,
  },
];
