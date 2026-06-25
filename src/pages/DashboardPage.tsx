import { Dashboard } from '@/features/dashboard';
import { useLanguage } from '@/shared/hooks/useLanguage';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.dashboard} | ${t.appName}`}</title>
        <meta name="description" content={t.dashboard.subtitle} />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
