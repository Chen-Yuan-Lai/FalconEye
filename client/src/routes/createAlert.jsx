import { useState, useEffects, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useLoaderData, redirect, Form, useNavigate } from 'react-router-dom';
import { Layout, Steps, Button, Input } from 'antd';
import {
  getUser,
  getProjects,
  getProjectMembers,
  getTriggersTypes,
  createAlert,
} from '../utils/fetchData.js';
import { When, Then } from '../components/conditions.jsx';
import TriggersDropdowns from '../components/triggers.jsx';
import ChannelDropdowns from '../components/channels.jsx';
import CusFooter from '../components/footer.jsx';

const { Content, Header } = Layout;

export async function action({ request }) {
  try {
    const jwt = localStorage.getItem('jwt');
    await getUser(jwt);

    const formData = await request.formData();
    const alertData = Object.fromEntries(formData);
    console.log(alertData);

    const triggerKeys = Object.keys(alertData)
      .join(',')
      .match(/trigger-[0-9]+/g);

    const channelKeys = Object.keys(alertData)
      .join(',')
      .match(/channel-[0-9]+/g);

    if (!triggerKeys || !channelKeys) {
      alert("triggers and channels can't be empty");
      return null;
    }

    const uniTriggerKeys = Array.from(new Set(triggerKeys));
    const uniChannelKeys = Array.from(new Set(channelKeys));
    console.log(uniTriggerKeys);

    const triggers = uniTriggerKeys.map(el => {
      const trigger = {};
      trigger.triggerTypeId = alertData[el];
      if (alertData[`${el}-threshold`]) trigger.threshold = alertData[`${el}-threshold`];
      if (alertData[`${el}-timeWindow`]) trigger.timeWindow = alertData[`${el}-timeWindow`];
      return trigger;
    });

    const channels = uniChannelKeys.map(el => {
      const channel = { type: 'line' };
      channel.userId = alertData[`${el}-userId`];
      if (alertData[`${el}-token`]) channel.token = alertData[`${el}-token`];
      return channel;
    });

    const data = { triggers, channels, active: true };
    Object.keys(alertData).forEach(el => {
      if (!el.startsWith('trigger') && !el.startsWith('channel')) {
        data[el] = alertData[el];
      }
    });

    console.log(data);

    const res = await createAlert(jwt, data.projectId, data);

    if (!res) {
      alert('Something wrong!');
      return null;
    }

    alert('create an alert successfully');
    return null;
  } catch (error) {
    alert(error);
    return null;
  }
}

export async function loader() {
  try {
    const jwt = localStorage.getItem('jwt');
    await getUser(jwt);

    const { data: projectsData } = await getProjects(jwt);
    const { data: triggersTypesData } = await getTriggersTypes(jwt);

    const projects = projectsData?.map(el => ({ value: el.id, text: `${el.framework}-${el.id}` }));
    const triggersTypes = triggersTypesData?.map(el => ({ value: el.id, text: el.description }));

    return {
      projects,
      triggersTypes,
    };
  } catch (err) {
    alert('Please sign in first');
    return redirect('/signin');
  }
}

const filters = [
  {
    value: 'any',
    text: 'Any',
  },
  {
    value: 'all',
    text: 'All',
  },
];

const AlertTitle = ({ num, text }) => (
  <div className="flex flex-row gap-4">
    <span className="flex justify-center items-center rounded-full bg-yellow-500 text-black h-8 w-8 p-1 text-center align-middle font-mono font-semibold">
      {num}
    </span>
    <h2>{text}</h2>
  </div>
);

export default function CreateAlert() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const projects = data.projects;
  const triggersTypes = data.triggersTypes;

  const [projectMembers, setProjectMembers] = useState(null);
  const [project, setProject] = useState(projects[0].value);
  const [triggers, setTriggers] = useState([{ id: uuid(), value: null }]);
  const [channels, setChannels] = useState([{ id: uuid(), value: null }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        alert('Please log in first');
        navigate('/signin');
        return;
      }
      try {
        const { data } = await getProjectMembers(jwt, project);
        const members = data.map(el => ({ value: el.id, text: el.email }));
        setProjectMembers(members);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project]);

  const handleProjectSelect = value => setProject(value);

  const handleTriggerSelect = (value, id) => {
    const newTriggers = triggers.map(trigger => (trigger.id === id ? { id, value } : trigger));
    setTriggers([...newTriggers, { id: uuid(), value: null }]);
  };

  const handleTriggerDelete = id => {
    setTriggers(triggers.filter(trigger => trigger.id !== id));
  };

  const handleChannelSelect = (value, id) => {
    const newChannels = channels.map(channel => (channel.id === id ? { id, value } : channel));
    setChannels([...newChannels, { id: uuid(), value: null }]);
  };

  const handleChannelDelete = id => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>New Alert Rule</h1>
      </Header>
      <Content
        className="px-10 py-9 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Form method="post" className="flex flex-col gap-y-10">
          <div className="flex flex-col justify-between gap-y-2">
            <AlertTitle num={1} text={'Select a project'} />
            <div className="ml-10 text-[16px]">
              <select
                name="projectId"
                onChange={handleProjectSelect}
                className="block w-[30%] border-gray-300 py-1 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
              >
                {projects.map(el => (
                  <option value={el.value} key={uuid()}>
                    {el.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-2">
            <AlertTitle num={2} text={'Set conditions'} />
            <div
              className="flex flex-col mt-3 gap-3 p-4 rounded-lg ml-10 text-[16px]"
              style={{ border: '1.5px solid #d1d5db' }}
            >
              <When filters={filters} />
              <TriggersDropdowns
                handleSelect={handleTriggerSelect}
                handleDelete={handleTriggerDelete}
                dropdowns={triggers}
                options={triggersTypes}
              />
              <Then />
              <ChannelDropdowns
                handleSelect={handleChannelSelect}
                handleDelete={handleChannelDelete}
                dropdowns={channels}
                options={projectMembers}
                loading={loading}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-2">
            <AlertTitle num={3} text={'Set action interval'} />
            <div className="ml-10 text-[16px]">
              <select
                name="actionInterval"
                className="w-[30%] border-gray-300 py-1 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
              >
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="10m">10 minutes</option>
                <option value="1hr">1 hour</option>
                <option value="3hr">3 hours</option>
                <option value="24hr">24 hours</option>
                <option value="1w">1 week</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-2">
            <AlertTitle num={4} text={'Add a name'} />
            <Input
              name="name"
              className="ml-10 text-[16px] w-[30%] border-gray-300 py-1 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-x-3">
            <Button type="primary" htmlType="submit">
              cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Content>
      <CusFooter />
    </Layout>
  );
}
