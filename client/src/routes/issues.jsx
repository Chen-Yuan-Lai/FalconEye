import { useEffect, useState } from "react";
import { useLoaderData, Outlet, useParams, Navigate } from "react-router-dom";
import { Layout, Space, Table, Tag } from "antd";
import CusFooter from "../components/footer.jsx";
import "../css/page.css";
import { getEvents } from "../utils/fetchData.js";

const { Content, Header } = Layout;
const columns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "TAGS",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "EVENTS",
    dataIndex: "events",
    key: "events",
  },
  {
    title: "USERS",
    dataIndex: "users",
    key: "users",
  },
];

export default function Issues() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        alert("Please log in first");
        return <Navigate to="/signin" />;
      }
      try {
        const { data } = await getEvents(jwt);
        setData(data);
        const events = data.map((el, i) => {
          const event = {
            key: i + 1,
            name: el.name,
            tags: [el.os_type],
            events: 1,
            users: "ian",
          };
          return event;
        });
        setData(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Dependency array includes userId

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <Layout className="site-layout ml-[200px] flex flex-col h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>Issues</h1>
      </Header>
      <Content
        className="px-10"
        style={{ border: "1px solid #d1d5db", overflow: "initial" }}
      >
        <Table columns={columns} dataSource={data} />
      </Content>
      <CusFooter />
    </Layout>
  );
}
