import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { routesConfig } from './config/routesConfig';
import 'config/configureMobX';
import 'styles/index.scss';

const router = createBrowserRouter(routesConfig, {
  basename: import.meta.env.BASE_URL,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(<RouterProvider router={router} />);
