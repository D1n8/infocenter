import { routesConfig } from "./config/routesConfig";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import 'config/configureMobX'
import 'styles/index.scss'

const router = createBrowserRouter(routesConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLDivElement
);

root.render(<RouterProvider router={router} />);