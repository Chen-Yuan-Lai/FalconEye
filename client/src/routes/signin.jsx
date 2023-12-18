import { useState } from 'react';
import { redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import SigninForm from '../components/signin.jsx';
import SignupForm from '../components/signup.jsx';
import { signin, signup } from '../utils/fetchData.js';
import Logo from '../assets/logo.svg';
import '../css/page.css';

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    const { email, password, formType } = userData;
    console.log(userData);

    for (let i = 0; i < Object.keys(userData).length; i++) {
      if (Object.values(userData)[i] === '') {
        throw new Error(`${Object.keys(userData)[i]} is required`);
      }
    }

    let res;
    if (formType === 'signin') {
      res = await signin(email, password);
    }

    if (formType === 'signup') {
      res = await signup(userData.firstName, userData.secondName, email, password);
    }
    if (res.status && res.status === 'fail') {
      throw new Error(res.data);
    }
    localStorage.setItem('jwt', res.data.token);
    await Swal.fire({
      title: 'Success!',
      text: `${formType} successfully!`,
      icon: 'success',
      timer: 1500,
      position: 'top',
      showConfirmButton: false,
      toast: true,
    });
    return redirect('/');
  } catch (err) {
    await Swal.fire({
      title: 'Error!',
      text: err.message,
      icon: 'error',
      timer: 1500,
      position: 'top',
      showConfirmButton: false,
      toast: true,
    });
    return null;
  }
}

export default function Signin() {
  const [signup, setSignup] = useState(false);

  const hanldeChange = value => {
    console.log(value);
    setSignup(value);
  };
  return (
    <div className=" min-h-screen flex flex-col gap-8 items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-600">
      <img alt="Logo" src={Logo} className=" filter-white h-20 object-contain " />
      <div className="login p-10 bg-white shadow-xl rounded-lg z-10 w-[30%]">
        {signup ? <SignupForm change={hanldeChange} /> : <SigninForm change={hanldeChange} />}
      </div>
    </div>
  );
}
