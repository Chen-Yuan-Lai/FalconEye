import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Spin, Space, Select, Divider } from 'antd';
import { Column } from '@ant-design/plots';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getProject } from '../utils/fetchData.js';

const { Content, Header } = Layout;

export default function Project() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [bin, setBin] = useState('1h');
  const [interval, setInterval] = useState('24h');
  const [eventsNumPerTime, setEventsNumPerTime] = useState(null);

  const navigate = useNavigate();

  const handleBinChange = value => {
    console.log(value);
    setBin(value);
  };
  const handleIntervalChange = value => {
    setInterval(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
          alert('Please log in first');
          navigate('/signin');
          return;
        }
        let eventsNumPerTime = [];
        console.log(bin, interval);
        const { data } = await getProject(jwt, projectId, bin, interval);
        console.log(data);
        setProject(data.project);
        if (data.eventsNumPerTime) eventsNumPerTime = data.eventsNumPerTime;
        setEventsNumPerTime(eventsNumPerTime);
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bin, interval]);

  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>{loading ? 'Loading' : project.name}</h1>
      </Header>
      <Content
        loading={loading}
        className="p-8 min-h-[75vh] flex flex-col justify-start gap-3"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <div className="flex flex-col bg-white rounded-lg p-3">
          <div>
            {loading ? (
              <Spin />
            ) : (
              <ErrorColumn eventsNumPerTime={eventsNumPerTime} interval={interval} />
            )}
          </div>
          <Divider />
          <div>
            {loading ? (
              <Spin />
            ) : (
              <div className="flex flex-row justify-between">
                <div className="text-base text-gray-500">
                  Total Errors {eventsNumPerTime.reduce((acc, cur) => acc + +cur.event_count, 0)}
                </div>
                <Space.Compact>
                  <Select
                    value={bin || '1h'}
                    style={{
                      width: 120,
                    }}
                    onChange={handleBinChange}
                    options={[
                      {
                        value: '1h',
                        label: '1 hour',
                      },
                      {
                        value: '4h',
                        label: '4 hours',
                      },
                    ]}
                  />
                  <Select
                    value={interval || '1d'}
                    style={{
                      width: 120,
                    }}
                    onChange={handleIntervalChange}
                    options={[
                      {
                        value: '24h',
                        label: 'Last 24 hour',
                      },
                      {
                        value: '7d',
                        label: 'Last 7 days',
                      },
                      {
                        value: '14d',
                        label: 'Last 14 days',
                      },
                      {
                        value: '30d',
                        label: 'Last 30 days',
                      },
                    ]}
                  />
                </Space.Compact>
              </div>
            )}
          </div>
        </div>
      </Content>
      <CusFooter />
    </Layout>
  );
}

const ErrorColumn = ({ eventsNumPerTime, interval }) => {
  const data = eventsNumPerTime.map(el => {
    const bin = {
      time: el.hourly_interval.split('-')[0],
      count: +el.event_count,
    };
    return bin;
  });

  const config = {
    data,
    grid: true,
    height: 400,
    theme: 'classic',
    xField: 'time',
    yField: 'count',
    columnWidthRatio: 0.8,
    title: {
      title: 'Errors before past 24h',
      size: 45,
      style: {
        titleFontSize: 23,
      },
    },
    axis: {
      x: {
        line: true,
        tickFilter: (tick, i) => {
          if (interval === '7d') {
            return i % 5 === 0;
          }
          if (interval === '14d') {
            return i % 14 === 0;
          }
          return i % 3 === 0;
        },
      },
    },
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    style: {
      // 圆角样式
      radiusTopLeft: 15,
      radiusTopRight: 15,
      fill: '#174795',
      maxWidth: 100,
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
