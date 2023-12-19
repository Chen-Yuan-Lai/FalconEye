import { useEffect, useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { Layout, Table, Tag, Button } from 'antd';
import CusFooter from '../components/footer.jsx';
import IssueSelect from '../components/issueSelect.jsx';
import '../css/page.css';
import { getIssues, updateIssues } from '../utils/fetchData.js';
import Swal from 'sweetalert2';

const { Content, Header } = Layout;
const columns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Link to={`/issues/issue/${encodeURIComponent(record.fingerprints)}`}>{text}</Link>
    ),
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (_, { status }) => <Tag color={status === 'handled' ? 'green' : 'red'}>{status}</Tag>,
  },
  {
    title: 'FRAMEWORK',
    dataIndex: 'framework',
    key: 'framework',
  },
  {
    title: 'LAST SEEN | FIRST SEEN',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'EVENTS',
    dataIndex: 'events',
    key: 'events',
  },
  {
    title: 'USERS',
    dataIndex: 'users',
    key: 'users',
  },
];

// tag 可以優化成useEffect 偵測url query/search parameter的改變 (用 Link改URL)
export default function Issues() {
  const projects = useOutletContext() || [];

  let projectNames = [];
  if (projects.length > 0) {
    projectNames = projects.map(el => {
      const project = {
        value: el.id,
        label: el.name,
      };
      return project;
    });
  }

  const [issues, setIssues] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState(null);
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  const [projectId, setProjectId] = useState(
    projectNames.length > 0 ? projectNames[0].value : null
  );
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleStatsPeriodChange = value => {
    setStatsPeriod(value);
  };
  const handleSortChange = value => {
    setSort(value);
  };
  const handleProjectIdChange = value => {
    console.log(value);
    setProjectId(value);
  };
  const handleStatusChange = value => {
    setStatus(value);
  };

  const onSelectChange = (_, newSelectedRows) => {
    console.log('selectedRows changed: ', newSelectedRows);
    setSelectedRows(newSelectedRows);
  };

  const start = async () => {
    try {
      setUpdateLoading(true);
      const jwt = localStorage.getItem('jwt');
      const fingerprintsArr = selectedRows.map(el => el.fingerprints);

      await updateIssues(jwt, fingerprintsArr, 'handled');
      setUpdateLoading(false);
      await Swal.fire({
        title: 'Success!',
        text: `Resolve successfully!`,
        icon: 'success',
        timer: 1500,
        position: 'top',
        showConfirmButton: false,
        toast: true,
      });
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
      setUpdateLoading(false);
    }
  };

  const rowSelection = {
    onChange: onSelectChange,
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        navigate('/signin');
        return;
      }
      try {
        const { data } = await getIssues(jwt, projectId, status, statsPeriod, sort);
        let issues = [];
        if (data) {
          issues = data.map((el, i) => {
            const { first_seen, latest_seen } = el;
            const firstSeen = Object.entries(first_seen);
            const lastSeen = Object.entries(latest_seen);
            const time = `${firstSeen[0][1]} ${firstSeen[0][0]} ago | ${lastSeen[0][1]} ${lastSeen[0][0]} ago`;
            console.log(el.events);
            const issue = {
              key: i + 1,
              name: el.name,
              status: el.status,
              framework: el.project_framework,
              time: time,
              events: el.events,
              users: el.users,
              params: el.event_ids.map(el => `id=${el}`).join('&'),
              fingerprints: el.fingerprints,
            };
            return issue;
          });
        }

        setIssues(issues);
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
  }, [projectId, status, statsPeriod, sort]); // Dependency array includes userId

  const hasSelected = selectedRows.length > 0;

  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <div className="flex flex-row justify-between items-center">
          <h1>Issues</h1>
          <Button
            loading={updateLoading}
            onClick={start}
            disabled={!hasSelected}
            type="primary"
            className="bg-slate-800 text-white"
          >
            Resolve
          </Button>
        </div>
      </Header>
      <Content
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <IssueSelect
          statsPeriod={statsPeriod}
          projectId={projectId}
          status={status}
          handleStatsPeriodChange={handleStatsPeriodChange}
          handleProjectIdChange={handleProjectIdChange}
          handleStatusChange={handleStatusChange}
          projectNames={projectNames}
        />
        <Table
          loading={loading}
          className="mt-3"
          columns={columns}
          dataSource={issues}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
        />
      </Content>
      <CusFooter />
    </Layout>
  );
}
