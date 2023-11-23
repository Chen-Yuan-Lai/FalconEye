import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";
import "./css/index.css";
import Root, { loader as rootLoader } from "./routes/root.jsx";
import Issues from "./routes/issues.jsx";
import Signin, { action as signinAction } from "./routes/signin.jsx";
import ErrorPage from "./routes/error-page.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Issues />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
    action: signinAction,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
