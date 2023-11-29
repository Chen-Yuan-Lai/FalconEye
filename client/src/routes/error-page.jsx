import { useRouteError } from 'react-router-dom';
import { Layout } from 'antd';
import CusFooter from '../components/footer.jsx';

const { Content } = Layout;

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Layout className="error-page site-layout flex flex-col h-screen">
      <Content className="px-10" style={{ border: '1px solid #d1d5db', overflow: 'initial' }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </Content>
      <CusFooter />
    </Layout>
  );
}
