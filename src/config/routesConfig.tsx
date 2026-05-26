import App from 'App/index';
import AuthPage from 'App/pages/Auth';
import ChartBuilderPage from 'App/pages/ChartBuilderPage';
import ChartListSettings from 'App/pages/ChartListSettings';
import OperationalManagement from 'App/pages/OperationalManagement';
// import Main from '../App/pages/Main';
import OpManLayout from 'App/pages/OperationalManagement/OpManLayout';
import SettingsPage from 'App/pages/SettingsPage/SettingsPage';
import { Navigate, type RouteObject } from 'react-router';

import { routes } from './routes';

export const routesConfig: RouteObject[] = [
  {
    path: routes.main.mask,
    element: <App />,
    children: [
      // {
      //   index: true,
      //   element: <Main />,
      // },
      {
        path: routes.settings.mask,
        element: <SettingsPage />,
      },
      {
        path: routes.operationalManagement.mask,
        element: <OpManLayout />,
        children: [
          { index: true, element: <OperationalManagement /> },
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
