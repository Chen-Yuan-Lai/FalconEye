import { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { CiSettings } from 'react-icons/ci';
import { Layout, Card, Button, Modal, Spin, Empty } from 'antd';
import { Tiny } from '@ant-design/plots';
import { SiExpress, SiJavascript } from 'react-icons/si';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getProject } from '../utils/fetchData.js';

const { Content, Header } = Layout;

const CardTitle = ({ id, name, showModal, logo }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <Link to={`/projects/${id}`} className="flex flex-row items-center gap-2">
        {logo === 'express' ? (
          <SiExpress className="bg-black text-white text-[2rem]" />
        ) : (
          <SiJavascript />
        )}
        <span>{name}</span>
      </Link>
      <CiSettings
        onClick={showModal}
        className="cursor-pointer text-[1.5rem] hover:bg-gray-200 rounded-full"
      />
    </div>
  );
};

export default function Projects() {
  const projects = useOutletContext() || [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [dailyError, setDailyError] = useState(null);
  const navigate = useNavigate();

  const showModal = item => {
    setIsModalOpen(true);
    setCurrentItem(item);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
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
        const dailyErrorPromises = projects.map(el => getProject(jwt, el.id, '1h', '24h'));

        const dailyErrorData = (await Promise.all(dailyErrorPromises)).map(el => {
          const d = {
            id: el.data.project.id,
            eventsNumPerTime: el.data.eventsNumPerTime,
          };
          return d;
        });
        console.log(dailyErrorData);
        setDailyError(dailyErrorData);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout className="site-layout flex flex-col">
      <Header className="bg-white h-[15vh]">
        <div className="flex flex-row justify-between items-center">
          <h1>Projects</h1>
          <Link to={'/projects/new'}>
            <Button type="primary" className="bg-slate-800 text-white">
              Create a new project
            </Button>
          </Link>
        </div>
      </Header>
      <Content
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Modal title="Client Token" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          {currentItem ? <span>{currentItem}</span> : <Spin />}
        </Modal>
        {projects.length ? (
          <div className="grid grid-cols-3 gap-x-3 gap-y-3 mt-4">
            {projects.map((el, i) => (
              <Card
                loading={loading}
                title={
                  <CardTitle
                    showModal={() => showModal(el.client_token)}
                    name={el.name}
                    id={el.id}
                    logo={el.framework}
                  />
                }
                bordered={true}
                key={i}
              >
                <div className="flex flex-col">
                  {loading ? (
                    <Spin />
                  ) : (
                    <DailyError
                      dailyError={dailyError.find(e => e.id === el.id).eventsNumPerTime}
                    />
                  )}
                  <span>Errors: {el.errors}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty className="mt-5" />
        )}
      </Content>
      <CusFooter />
    </Layout>
  );
}

const DailyError = ({ dailyError }) => {
  console.log(dailyError);
  const data = dailyError.map(el => {
    const bin = {
      time: el.hourly_interval.split('-')[0],
      count: +el.event_count,
    };
    return bin;
  });
  const config = {
    data,
    axis: {
      x: {
        line: true,
      },
    },
    width: 180,
    height: 80,
    padding: 8,
    xField: 'time',
    yField: 'count',
    style: {
      fill: '#174795',
    },
  };
  return <Tiny.Column {...config} />;
};
