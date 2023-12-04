import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'antd/dist/reset.css';
import './css/index.css';
import Root, { loader as rootLoader } from './routes/root.jsx';
import Issues, { loader as issueLoader } from './routes/issues.jsx';
import Issue from './routes/issue.jsx';
import Projects from './routes/projects.jsx';
import Project from './routes/project.jsx';
import CreateAlert, {
  action as createAlertAction,
  loader as createAlertLoader,
} from './routes/createAlert.jsx';
import Signin, { action as signinAction } from './routes/signin.jsx';
import ErrorPage from './routes/error-page.jsx';
import Alerts, { loader as alertsLoader } from './routes/alerts.jsx';
import Alert from './routes/alert.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: issueLoader,
        element: <Issues />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'issues',
        element: <Issues />,
        loader: issueLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: 'issues/issue',
        element: <Issue />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'projects',
        element: <Projects />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'projects/:projectId',
        element: <Project />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'alerts/new',
        element: <CreateAlert />,
        action: createAlertAction,
        loader: createAlertLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
        loader: alertsLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: 'alert/:id',
        element: <Alert />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
    action: signinAction,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
