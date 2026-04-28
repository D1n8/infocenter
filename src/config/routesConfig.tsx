import { Navigate, type RouteObject } from 'react-router';

import App from '../App';
import AuthPage from '../App/pages/Auth';
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
        path: '*',
        element: <Navigate to={routes.main.mask} replace />,
      },
    ],
  },
];
