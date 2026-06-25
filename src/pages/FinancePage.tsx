import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { FinanceTracker } from '@/features/finance-tracker';

const FinancePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.finance} | ${t.appName}`}</title>
        <meta name="description" content={t.finance.subtitle} />
      </Helmet>
      <FinanceTracker />
    </>
  );
};

export default FinancePage;
