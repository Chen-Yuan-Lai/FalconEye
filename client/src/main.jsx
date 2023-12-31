import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'antd/dist/reset.css';
import './css/index.css';
import Dashboard, { loader as dashboardLoader } from './routes/dashboard.jsx';
import Issues from './routes/issues.jsx';
import Issue from './routes/issue.jsx';
import Projects from './routes/projects.jsx';
import Project from './routes/project.jsx';
import CreateProject, { action as createProjectAction } from './routes/createProject.jsx';
import CreateAlert, {
  action as createAlertAction,
  loader as createAlertLoader,
} from './routes/createAlert.jsx';
import Signin, { action as signinAction } from './routes/signin.jsx';
import ErrorPage from './routes/error-page.jsx';
import Alerts from './routes/alerts.jsx';
import Alert from './routes/alert.jsx';
import Root from './routes/root.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    loader: dashboardLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // loader: issueLoader,
        element: <Issues />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'issues',
        element: <Issues />,
        // loader: issueLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: 'issues/issue/:fingerprints',
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
        path: 'projects/new',
        element: <CreateProject />,
        action: createProjectAction,
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
  {
    path: '/root',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
