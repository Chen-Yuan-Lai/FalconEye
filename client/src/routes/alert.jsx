import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Spin, Select, Card } from 'antd';
import { Area } from '@ant-design/plots';
import CusFooter from '../components/footer.jsx';
import { getAlert } from '../utils/fetchData.js';
import '../css/page.css';

const { Content, Header } = Layout;

const AlertArea = ({ alertTriggeredPerHour }) => {
  const config = {
    data: alertTriggeredPerHour,
    xField: 'hourly_interval',
    yField: 'triggered_times',
    xAxis: {
      tickLine: null,
      // Optional: Adjust the number of ticks based on your data
      tickCount: 5,
      range: [0, 1],
    },
  };

  return <Area {...config} />;
};

export default function Alert() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [alertsTriggeredPerHour, setAlertsTriggeredPerHour] = useState(null);
  const [statPeriod, setStatPeriod] = useState(null);

  const handleChange = value => {
    console.log(`selected ${value}`);
    setStatPeriod(value);
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
        console.log(data.alertTriggeredPerHour);
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
          <div className="flex flex-row gap-5">
            <h1>{alert.name}</h1>
          </div>
        )}
      </Header>
      <Select
        defaultValue="24h"
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
      <Content
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Card className="mt-3" title="Alert triggered" loading={loading}>
          <AlertArea alertTriggeredPerHour={alertsTriggeredPerHour} />
        </Card>
      </Content>
      <CusFooter />
    </Layout>
  );
}
