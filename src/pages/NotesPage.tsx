import { QuickNotes } from '@/features/quick-notes';
import { useLanguage } from '@/shared/hooks/useLanguage';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const NotesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.notes.title} | ${t.appName}`}</title>
        <meta name="description" content={t.notes.subtitle} />
      </Helmet>
      <QuickNotes />
    </>
  );
};

export default NotesPage;
