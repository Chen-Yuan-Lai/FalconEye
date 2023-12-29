import { Form } from 'react-router-dom';
import { Button, Input } from 'antd';
import '../css/page.css';
export default function SigninForm({ change }) {
  return (
    <>
      <Form
        method="post"
        className="login-form flex flex-col text-[14px] text-[#070707] gap-3 font-sans text-xl leading-tight"
      >
        <input type="hidden" name="formType" value="signin" />
        <h1 className="text-center">Welcome Back!</h1>
        <Input
          defaultValue={'a186235@gmail.com'}
          type="email"
          name="email"
          addonBefore={
            <div className="addon-wrapper">
              <span className="addon-text">Email</span>
            </div>
          }
        />
        <Input.Password
          defaultValue={'1234'}
          name="password"
          addonBefore={
            <div className="addon-wrapper">
              <span className="addon-text">Password</span>
            </div>
          }
        />
        <div className="flex flex-row mt-5 justify-around gap-3 items-center">
          <Button type="primary" className="bg-slate-800" htmlType="submit" block>
            Login
          </Button>
          <Button
            type="primary"
            className="bg-slate-800"
            onClick={() => {
              change(true);
            }}
          >
            signup
          </Button>
        </div>
      </Form>
    </>
  );
}
