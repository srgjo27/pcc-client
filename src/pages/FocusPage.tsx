import { FocusMode } from '@/features/focus';
import { useLanguage } from '@/shared/hooks/useLanguage';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const FocusPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.focus} | ${t.appName}`}</title>
        <meta name="description" content={t.focus.subtitle} />
      </Helmet>
      <FocusMode />
    </>
  );
};

export default FocusPage;
