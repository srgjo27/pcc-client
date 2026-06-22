import React from 'react';
import { Helmet } from 'react-helmet-async';
import { strings } from '@/constants/strings';
import { LoginForm } from '@/features/auth';

const LoginPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Login | PCC Client</title>
        <meta name="description" content="Masuk ke dalam aplikasi PCC Client menggunakan akun Anda." />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <LoginForm />
        <span className="text-xs text-slate-400">
          {`${strings.version} ${strings.systemVersion}`}
        </span>
      </div>
    </>
  );
};

export default LoginPage;
