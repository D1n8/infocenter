import { Navigate, type RouteObject } from 'react-router';

import App from '../App';
import AuthPage from '../App/pages/Auth';
import ChartBuilderPage from '../App/pages/ChartBuilderPage';
import ChartListSettings from '../App/pages/ChartListSettings';
import Main from '../App/pages/Main';

import { routes } from './routes';

export const routesConfig: RouteObject[] = [
  {
    path: routes.main.mask,
    element: <App />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: routes.auth.mask,
        element: <AuthPage />,
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
        element: <Navigate to={routes.main.mask} replace />,
      },
    ],
  },
];
