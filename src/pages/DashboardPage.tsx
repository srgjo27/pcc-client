import { Dashboard } from '@/features/dashboard';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | PCC Client</title>
        <meta name="description" content="Dashboard ringkasan produktivitas harian dan evaluasi mingguan berbasis AI untuk PCC Client." />
      </Helmet>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
