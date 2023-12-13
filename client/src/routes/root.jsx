import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import Logo from '../assets/logo.svg';
import '../css/page.css';

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen max-w-screen font-mono">
      <header className="bg-whit text-xl flex flex-row items-center justify-between h-20 pt-4 px-4 pb-1">
        <div className="flex flex-row items-center gap-3">
          <img alt="Logo" src={Logo} className="h-12 object-contain" />
          <span className="text-3xl">FalconEye</span>
        </div>
        <nav className="flex flex-row gap-4">
          <Link className="rounded-lg hover:bg-slate-400 p-1" to={'/signin'}>
            Signin
          </Link>
          <Link className="rounded-lg hover:bg-slate-400 p-1" to={'/doc'}>
            Doc
          </Link>
          <Link className="rounded-lg hover:bg-slate-400 p-1" to={'/API'}>
            API
          </Link>
        </nav>
      </header>
      <div className="h-[1.3px] bg-black"></div>
      <footer></footer>
    </div>
  );
}
