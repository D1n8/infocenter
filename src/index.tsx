import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routesConfig } from './config/routesConfig';
import { useRootStore } from './store/RootStore/RootStore';
import 'config/configureMobX';
import 'styles/index.scss';

const router = createBrowserRouter(routesConfig, {
  basename: import.meta.env.BASE_URL,
});

function RootApp() {
  const { userStore } = useRootStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    userStore.checkAuth().finally(() => {
      setIsInitializing(false);
    });
  }, [userStore]);

  if (isInitializing) {
    return null;
  }

  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(<RootApp />);
