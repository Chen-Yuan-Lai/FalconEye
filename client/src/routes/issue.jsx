import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Spin, Button } from 'antd';
import CusFooter from '../components/footer.jsx';
import Event from '../components/event.jsx';
import { getEvent, getEventsByFingerprints } from '../utils/fetchData.js';
import '../css/page.css';

const { Content, Header } = Layout;

export default function Issue() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState(null);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(0);
  const { fingerprints } = useParams();

  const navigate = useNavigate();
  const handleClick = value => {
    let currentIndex = index;
    const currEventsSize = events.length;
    let curPage = page;

    if (currentIndex + value < currEventsSize && currentIndex + value >= 0) {
      setIndex(currentIndex + value);
    } else if (currentIndex + value >= currEventsSize && events.nextPage) {
      setPage(curPage + 1);
    } else if (currentIndex + value <= 0 && events.nextPage) {
      setPage(curPage - 1);
    }
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
        const event = await getEventsByFingerprints(jwt, fingerprints, page);
        console.log(event);
        if (event) {
          const { data } = event;
          setEvents(data);
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        {loading ? (
          <Spin />
        ) : (
          <div className="flex flex-row gap-5">
            <h1>{events[index].name}</h1>
            <h2>{`${events[index].method} ${events[index].url}`}</h2>
          </div>
        )}
      </Header>
      <Content
        className="px-10 py-5 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        {loading ? <Spin /> : <Event event={events[index]} handleClick={handleClick} />}
      </Content>
      <CusFooter />
    </Layout>
  );
}
