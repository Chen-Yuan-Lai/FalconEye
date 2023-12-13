import { Form } from 'react-router-dom';
import { Button, Input, Space } from 'antd';

export default function SignupForm({ change }) {
  return (
    <>
      <Form
        method="post"
        className="login-form flex flex-col text-[14px] text-[#070707] gap-3 font-sans text-xl leading-tight"
      >
        <input type="hidden" name="formType" value="signup" />
        <h1 className="text-center">Create an account</h1>
        <Space.Compact>
          <Input
            name="firstName"
            addonBefore={
              <div className="addon-wrapper">
                <span className="addon-text">First Name</span>
              </div>
            }
          />
          <Input
            name="secondName"
            addonBefore={
              <div className="addon-wrapper">
                <span className="addon-text">Last Name</span>
              </div>
            }
          />
        </Space.Compact>
        <Input
          type="email"
          name="email"
          addonBefore={
            <div className="addon-wrapper">
              <span className="addon-text">Email</span>
            </div>
          }
        />
        <Input.Password
          name="password"
          addonBefore={
            <div className="addon-wrapper">
              <span className="addon-text">Password</span>
            </div>
          }
        />
        <div className="flex flex-row mt-5 justify-around gap-3 items-center">
          <Button type="primary" className="bg-slate-800" htmlType="submit" block>
            Signup
          </Button>
          <Button
            type="primary"
            className="bg-slate-800"
            onClick={() => {
              change(false);
            }}
          >
            signin
          </Button>
        </div>
      </Form>
    </>
  );
}
