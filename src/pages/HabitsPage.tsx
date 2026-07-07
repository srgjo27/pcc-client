import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { HabitGymLog } from '@/features/habit-gym';

const HabitsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.habits.title} | ${t.appName}`}</title>
        <meta name="description" content={t.habits.subtitle} />
      </Helmet>
      <HabitGymLog />
    </>
  );
};

export default HabitsPage;
