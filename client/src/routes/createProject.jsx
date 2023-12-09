import { useState } from 'react';
import { redirect, Form } from 'react-router-dom';
import { Layout, Button, Input, Divider, Radio } from 'antd';
import { SiExpress, SiJavascript } from 'react-icons/si';
import { createProject } from '../utils/fetchData.js';
import CusFooter from '../components/footer.jsx';
import FormStep from '../components/formSteps.jsx';
import '../css/page.css';

const { Content, Header } = Layout;

export const action = async ({ request }) => {
  try {
    const jwt = localStorage.getItem('jwt');
    const formData = await request.formData();
    const projectData = Object.fromEntries(formData);
    const { platform: framework, name } = projectData;

    const res = await createProject(jwt, framework, name);
    alert('Create Project successfully!');
    return redirect('/projects');
  } catch (error) {
    alert(error);
    return null;
  }
};

const options = [
  {
    value: 'javascript',
    label: <SiJavascript className="text-yellow-300 bg-black text-[5rem]" />,
  },
  {
    value: 'express text-[5rem]',
    label: <SiExpress className="text-[5rem] text-black bg-white" />,
  },
];

export default function CreateProject() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const onChange1 = ({ target: { value } }) => {
    setValue1(value);
  };

  const onChange2 = value => {
    setValue2(value);
  };

  const allFieldsFilled = () => {
    return value1 && value2; // Add conditions for other fields
  };
  return (
    <Layout className="site-layout flex flex-col min-h-screen">
      <Header className="bg-white h-[15vh]">
        <h1>New Project</h1>
      </Header>
      <Content
        className="px-10 py-9 min-h-[75vh]"
        style={{ border: '1px solid #d1d5db', overflow: 'initial' }}
      >
        <Form method="post" className="flex flex-col gap-y-10">
          <div className="flex flex-col justify-between gap-y-2">
            <FormStep num={1} text={'Choose your platform'} />
            <Divider className="bg-gray-200" />
            <Radio.Group
              className="custom-radio-group gap-x-10"
              name="platform"
              size="large"
              options={options}
              onChange={onChange1}
              value={value1}
              optionType="button"
            />
          </div>
          <div className="flex flex-col justify-between gap-y-4">
            <FormStep num={2} text={'Name your project'} />
            <Input
              className="w-[50%]"
              onChange={onChange2}
              type="text"
              name="name"
              placeholder="your project name..."
            />
          </div>
          <div className="flex flex-row items-center justify-end">
            <Button
              disabled={!allFieldsFilled()}
              type="primary"
              className="bg-slate-800"
              htmlType="submit"
            >
              Create Project
            </Button>
          </div>
        </Form>
      </Content>
      <CusFooter />
    </Layout>
  );
}
