import { useState, useEffect } from 'react';
import { useNavigate, redirect, Link, useParams } from 'react-router-dom';
import { Layout, Card, Col, Row } from 'antd';
import CusFooter from '../components/footer.jsx';
import '../css/page.css';
import { getProjects } from '../utils/fetchData.js';

const { Content, Header } = Layout;

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
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
        const { data } = await getProjects(jwt);
        setProjects(data);
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
        <h1>Projects</h1>
      </Header>
      <Content
        // loading={loading}
        className="px-10 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <div className="grid grid-cols-3 gap-x-3 gap-y-3 mt-4">
          {projects.map((el, i) => (
            <Card
              loading={loading}
              title={<Link to={`/projects/${el.id}`}>{`${el.framework}-${el.id}`}</Link>}
              bordered={false}
              key={i}
            >
              Errors: {el.errors}
            </Card>
          ))}
        </div>
      </Content>
      <CusFooter />
    </Layout>
  );
}
