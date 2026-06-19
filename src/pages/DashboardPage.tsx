import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardOverview } from '../features/dashboard';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | PCC Client</title>
        <meta name="description" content="Dashboard monitoring performa sistem, koneksi jaringan, dan aktivitas log untuk PCC Client." />
      </Helmet>
      <DashboardOverview />
    </>
  );
};

export default DashboardPage;
