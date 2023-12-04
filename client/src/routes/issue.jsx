import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import CusFooter from '../components/footer.jsx';
import Event from '../components/event.jsx';
import { getEvent } from '../utils/fetchData.js';
import '../css/page.css';

const { Content, Header } = Layout;

export default function Issue() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventIds = queryParams.getAll('id');
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
        const event = await getEvent(jwt, eventIds);
        if (event) {
          const { data } = event;
          setEvent(data);
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-row gap-5">
            <h1>{event.name}</h1>
            <h2>{`${event.method} ${event.url}`}</h2>
          </div>
        )}
      </Header>
      <Content
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        {loading ? <Spin /> : <Event event={event} />}
      </Content>
      <CusFooter />
    </Layout>
  );
}
