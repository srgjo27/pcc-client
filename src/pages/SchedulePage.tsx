import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ScheduleView } from '@/features/unified-schedule';

const SchedulePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.schedule} | ${t.appName}`}</title>
        <meta name="description" content={t.schedule.subtitle} />
      </Helmet>
      <ScheduleView />
    </>
  );
};

export default SchedulePage;
