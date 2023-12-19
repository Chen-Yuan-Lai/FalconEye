import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Spin, Select, Card, Switch } from 'antd';
import { Area } from '@ant-design/plots';
import CusFooter from '../components/footer.jsx';
import { getAlert, updateAlert } from '../utils/fetchData.js';
import '../css/page.css';

const { Content, Header } = Layout;

const AlertArea = ({ alertTriggeredPerHour }) => {
  const data = alertTriggeredPerHour.map(el => {
    const point = {
      hourly_interval: el.hourly_interval.split('-')[0].split(':')[0],
      triggered_times: +el.event_count,
    };
    return point;
  });
  const config = {
    data,
    xField: 'hourly_interval',
    yField: 'triggered_times',
    axis: {
      x: {
        line: true,
        tickFilter: (tick, i) => {
          return i % 11 === 0;
        },
        tickDirection: 'negative',
      },
    },
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkblue 100%)',
    },
    line: {
      style: {
        stroke: 'darkblue',
        strokeWidth: 2,
      },
    },
  };

  return <Area {...config} />;
};

export default function Alert() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [alertsTriggeredPerHour, setAlertsTriggeredPerHour] = useState(null);
  const [statPeriod, setStatPeriod] = useState(null);

  const handleChange = value => {
    console.log(`selected ${value}`);
    setStatPeriod(value);
  };

  const onChange = async checked => {
    setSwitchLoading(true);
    const jwt = localStorage.getItem('jwt');
    try {
      console.log(`switch to ${checked}`);
      await updateAlert(jwt, id, checked);
      setSwitchLoading(false);
    } catch (err) {
      alert(err.message);
    }
  };

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
        const { data } = await getAlert(jwt, id, statPeriod);
        setAlert(data.alert);
        setSwitchLoading(false);
        console.log(data);
        setAlertsTriggeredPerHour(data.alertTriggeredPerHour);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [statPeriod]);

  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-row justify-between items-center">
            <h1>{alert.name}</h1>
            <Switch
              loading={switchLoading}
              checkedChildren="Active"
              unCheckedChildren="Muted"
              defaultChecked={alert.active}
              onChange={onChange}
              disabled={alert.active === null}
            />
          </div>
        )}
      </Header>
      <Content
        className="px-10 min-h-[75vh] p-5"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Select
          defaultValue="7d"
          style={{
            width: 120,
          }}
          loading={loading}
          onChange={handleChange}
          options={[
            {
              value: '24h',
              label: 'Last 24 hours',
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
        <Card className="mt-3" title="Alert triggered" loading={loading}>
          <AlertArea alertTriggeredPerHour={alertsTriggeredPerHour} />
        </Card>
      </Content>
      <CusFooter />
    </Layout>
  );
}
