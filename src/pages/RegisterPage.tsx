import { strings } from '@/constants/strings';
import { RegisterForm } from '@/features/auth';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const RegisterPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Daftar Akun | PCC Client</title>
        <meta name="description" content="Buat akun baru Anda di PCC Client untuk mengakses layanan kami." />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <RegisterForm />
        <span className="text-xs text-slate-400">
          {`${strings.version} ${strings.systemVersion}`}
        </span>
      </div>
    </>
  );
};

export default RegisterPage;
