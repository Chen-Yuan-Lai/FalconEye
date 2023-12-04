import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, Link, redirect } from 'react-router-dom';
import { Layout, Table } from 'antd';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getAlerts, getProjects } from '../utils/fetchData.js';
import AlertSelect from '../components/alertSelect.jsx';

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
        label: `${el.framework} ${el.id}`,
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
  const projectNames = useLoaderData();
  const [alerts, setAlerts] = useState(null);
  const [status, setStatus] = useState(null);
  const [projectId, setProjectId] = useState(projectNames[0].value);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, status]); // Dependency array includes userId

  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>Alerts</h1>
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
        />
        <Table loading={loading} className="mt-3" columns={columns} dataSource={alerts} />
      </Content>
      <CusFooter />
    </Layout>
  );
}
