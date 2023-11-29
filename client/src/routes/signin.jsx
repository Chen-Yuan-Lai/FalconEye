import { redirect } from 'react-router-dom';
import backgroundImage from '../assets/login.webp';
import SigninForm from '../components/signin.jsx';
import { signin } from '../utils/fetchData.js';
import '../css/page.css';

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    const { email, password } = userData;
    const res = await signin(email, password);
    localStorage.setItem('jwt', res.data.token);
    alert('sign up successfully');
    return redirect('/');
  } catch (error) {
    alert(error);
    return null;
  }
}

export default function Signin() {
  return (
    <div
      className=" flex flex-col justify-center items-center h-screen w-screen bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="login">
        <SigninForm />
      </div>
    </div>
  );
}
