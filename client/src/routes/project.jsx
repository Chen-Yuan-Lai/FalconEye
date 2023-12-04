import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card } from 'antd';
import { Column } from '@ant-design/plots';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getProject } from '../utils/fetchData.js';

const { Content, Header } = Layout;

const DemoColumn = ({ eventPerHour }) => {
  const data = eventPerHour.map(el => {
    const bin = {
      time: el.hourly_interval.split('-')[0],
      count: +el.event_count,
    };
    return bin;
  });

  const config = {
    data,
    xField: 'time',
    yField: 'count',
    columnWidthRatio: 0.8,
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      time: {
        alias: 'time interval',
      },
      count: {
        alias: 'error number',
      },
    },
  };
  return <Column {...config} />;
};

export default function Project() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [eventsNumPerTime, setEventsNumPerTime] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
          alert('Please log in first');
          navigate('/signin');
          return;
        }
        const { data } = await getProject(jwt, projectId, '1h', '24h');
        setProject(data.project);
        setEventsNumPerTime(data.eventsNumPerTime);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>{loading ? 'Loading' : project.framework}</h1>
      </Header>
      <Content
        loading={loading}
        className="pl-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Card className="mt-3" title="Errors before past 24h" loading={loading}>
          <DemoColumn eventsNumPerTime={eventsNumPerTime} />
          <div className="mt-3 text-lg">
            Total Errors:{' '}
            {loading ? 'Loading' : eventsNumPerTime.reduce((acc, cur) => acc + +cur.event_count, 0)}
          </div>
        </Card>
      </Content>
      <CusFooter />
    </Layout>
  );
}
