import { Form, Link } from 'react-router-dom';
import { Button, Divider, Input, Typography } from 'antd';

export default function SigninForm() {
  return (
    <>
      <Form method="post" className="login-form flex flex-col text-[14px] text-[#070707] gap-3">
        <Typography.Title>Welcome Back!</Typography.Title>
        <div className="flex flex-row items-center">
          <span>Email: </span>
          <Input name="email" className="ml-3" placeholder="Enter your email" />
        </div>
        <div className="flex flex-row items-center">
          <span>Password: </span>
          <Input
            type="password"
            name="password"
            className="ml-3"
            placeholder="Enter your Password"
          />
        </div>
        <Button type="primary" className="bg-slate-800" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </>
  );
}
