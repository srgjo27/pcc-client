import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoginForm } from '@/features/auth';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`Login | ${t.appName}`}</title>
        <meta name="description" content={t.auth.loginDescription} />
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 relative">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
        <LoginForm />
        <span className="text-xs text-slate-400">
          {`${t.version} ${t.systemVersion}`}
        </span>
      </div>
    </>
  );
};

export default LoginPage;
