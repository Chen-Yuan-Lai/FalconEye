import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, Link, redirect, useOutletContext } from 'react-router-dom';
import { Layout, Table, Button } from 'antd';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getAlerts, getProjects } from '../utils/fetchData.js';
import AlertSelect from '../components/alertSelect.jsx';
import Swal from 'sweetalert2';

const { Content, Header } = Layout;
const columns = [
  {
    title: 'ALERT RULE',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/alert/${record.ruleId}`}>{text}</Link>,
  },
  {
    title: 'LAST TRIGGERED TIME',
    dataIndex: 'latestTriggeredTime',
    key: 'latestTriggeredTime',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'PROJECT',
    dataIndex: 'project',
    key: 'project',
  },
];

export async function loader() {
  try {
    const jwt = localStorage.getItem('jwt');
    const { data } = await getProjects(jwt);
    const projectNames = data.map(el => {
      const project = {
        value: el.id,
        label: el.name,
      };
      return project;
    });

    return projectNames;
  } catch (err) {
    alert('Please sign in first');
    return redirect('/signin');
  }
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(null);
  const [status, setStatus] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  const projects = useOutletContext();

  const projectNames = projects.map(el => {
    const project = {
      value: el.id,
      label: el.name,
    };
    return project;
  });

  const handleProjectIdChange = value => {
    console.log(`selected ${value}`);
    setProjectId(value);
  };
  const handleStatusChange = value => {
    console.log(`selected ${value}`);
    setStatus(value);
  };

  const navigate = useNavigate();
  console.log(projectNames);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert('Please log in first');
        navigate('/signin');
        return;
      }
      try {
        const res = await getAlerts(jwt, projectId);
        let alerts = null;
        if (res) {
          console.log(res.data);
          alerts = res.data.map((el, i) => {
            const alert = {
              key: i + 1,
              name: el.name,
              latestTriggeredTime: el.latest_triggered_time || 'Alert not triggered yet',
              status: el.active ? 'active' : 'muted',
              project: `${el.framework} ${el.project_id}`,
              ruleId: el.id,
            };
            return alert;
          });
        }

        setAlerts(alerts);
      } catch (err) {
        await Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          timer: 2000,
          position: 'top',
          showConfirmButton: false,
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, status]); // Dependency array includes userId

  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <div className="flex flex-row justify-between items-center">
          <h1>Alerts</h1>
          <Link to={'/alerts/new'}>
            <Button
              disabled={!projectNames.length > 0}
              type="primary"
              className="bg-slate-800 text-white"
            >
              Create a new alert
            </Button>
          </Link>
        </div>
      </Header>
      <Content
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <AlertSelect
          projectId={projectId}
          status={status}
          handleProjectIdChange={handleProjectIdChange}
          handleStatusChange={handleStatusChange}
          projectNames={projectNames}
          loading={loading}
        />
        <Table loading={loading} className="mt-3" columns={columns} dataSource={alerts} />
      </Content>
      <CusFooter />
    </Layout>
  );
}
