import { ToDo } from '@/features/to-do';
import { useLanguage } from '@/shared/hooks/useLanguage';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TodoPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.todo} | ${t.appName}`}</title>
        <meta name="description" content={t.todo.subtitle} />
      </Helmet>
      <ToDo />
    </>
  );
};

export default TodoPage;