import { useEffect, useState } from 'react';
import { useLoaderData, useParams, useNavigate, Link, redirect } from 'react-router-dom';
import { Layout, Table, Tag, Space } from 'antd';
import CusFooter from '../components/footer.jsx';
import IssueSelect from '../components/issueSelect.jsx';
import '../css/page.css';
import { getIssues, getProjects } from '../utils/fetchData.js';

const { Content, Header } = Layout;
const columns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <Link to={`/issues/issue/${record.fingerprints}`}>{text}</Link>,
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'PROJECT ID',
    dataIndex: 'projectId',
    key: 'projectId',
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
  // {
  //   title: 'TAGS',
  //   key: 'tags',
  //   dataIndex: 'tags',
  //   render: (_, { tags }) => (
  //     <>
  //       {tags.map(tag => {
  //         let color = tag.length > 5 ? 'geekblue' : 'green';
  //         if (tag === 'loser') {
  //           color = 'volcano';
  //         }
  //         return (
  //           <Tag color={color} key={tag}>
  //             {tag.toUpperCase()}
  //           </Tag>
  //         );
  //       })}
  //     </>
  //   ),
  // },
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
    console.error(err);
    alert('Please sign in first');
    return redirect('/signin');
  }
}

// tag 可以優化成useEffect 偵測url query/search parameter的改變 (用 Link改URL)
export default function Issues() {
  const [issues, setIssues] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState(null);
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleStatsPeriodChange = value => {
    setStatsPeriod(value);
  };
  const handleSortChange = value => {
    setSort(value);
  };
  const handleProjectIdChange = value => {
    setProjectId(value);
  };
  const handleStatusChange = value => {
    setStatus(value);
  };

  const projectNames = useLoaderData();
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
        console.log(data);
        if (data) {
          issues = data.map((el, i) => {
            const { first_seen, latest_seen } = el;
            const firstSeen = Object.entries(first_seen);
            const lastSeen = Object.entries(latest_seen);
            const time = `${firstSeen[0][1]} ${firstSeen[0][0]} ago | ${lastSeen[0][1]} ${lastSeen[0][0]} ago`;
            // tag 可能要改資料格式，避免issue 的url過長
            const issue = {
              key: i + 1,
              name: el.name,
              status: el.status,
              framework: el.project_framework,
              time: time,
              events: el.events,
              users: el.users,
              projectId: el.project_id,
              params: el.event_ids.map(el => `id=${el}`).join('&'),
              fingerprints: el.fingerprints,
            };
            return issue;
          });
        }

        setIssues(issues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, status, statsPeriod, sort]); // Dependency array includes userId

  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>Issues</h1>
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
        <Table loading={loading} className="mt-3" columns={columns} dataSource={issues} />
      </Content>
      <CusFooter />
    </Layout>
  );
}
