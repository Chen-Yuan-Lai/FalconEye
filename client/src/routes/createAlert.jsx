import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLoaderData, redirect, Form, Link } from 'react-router-dom';
import { Layout, Button, Input } from 'antd';
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
import FormStep from '../components/formSteps.jsx';

const { Content, Header } = Layout;

export async function action({ request }) {
  try {
    const jwt = localStorage.getItem('jwt');

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
    return redirect('/alerts');
  } catch (error) {
    alert(error);
    return null;
  }
}

export async function loader() {
  try {
    const jwt = localStorage.getItem('jwt');
    await getUser(jwt);

    const { data: projects } = await getProjects(jwt);
    const { data: triggersTypesData } = await getTriggersTypes(jwt);

    const emailPromises = [];
    projects.forEach(el => {
      emailPromises.push(getProjectMembers(jwt, el.id));
    });

    const emails = (await Promise.all(emailPromises)).map(el => el.data);

    const projectsMembers = projects.map((el, i) => ({
      id: el.id,
      emails: emails[i].map(el => ({ value: el.id, label: el.email })),
    }));

    console.log(projectsMembers);

    const triggersTypes = triggersTypesData?.map(el => ({ value: el.id, text: el.description }));

    return {
      projects,
      projectsMembers,
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

export default function CreateAlert() {
  const data = useLoaderData();
  const projects = data.projects;
  const members = data.projectsMembers;
  const triggersTypes = data.triggersTypes;

  const [projectMembers, setProjectMembers] = useState(members[0]);
  const [project, setProject] = useState(projects[0]);
  const [triggers, setTriggers] = useState([{ id: uuid(), value: null }]);
  const [channels, setChannels] = useState([{ id: uuid(), value: null }]);

  const handleProjectSelect = event => {
    const value = +event.target.value;
    console.log(value);

    const project = projects.find(el => el.id === value);
    const emails = members.find(el => +el.id === value);
    console.log(project, emails);
    setProject(project);
    setProjectMembers(emails);
  };

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
            <FormStep num={1} text={'Select a project'} />
            <div className="ml-10 text-[16px]">
              <select
                name="projectId"
                value={project.id}
                onChange={handleProjectSelect}
                className="block w-[30%] border-gray-300 py-1 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
              >
                {projects.map(el => (
                  <option value={el.id} key={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-2">
            <FormStep num={2} text={'Set conditions'} />
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
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-y-2">
            <FormStep num={3} text={'Set action interval'} />
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
            <FormStep num={4} text={'Add a name'} />
            <Input
              name="name"
              className="ml-10 text-[16px] w-[30%] border-gray-300 py-1 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-x-3">
            <Link to={'/alerts'}>
              <Button type="primary">cancel</Button>
            </Link>
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
