import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ToDoInfo } from '@/features/to-do';

const TodoInfoPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{`${t.menu.todo} | ${t.appName}`}</title>
        <meta name="description" content={t.todo.subtitle} />
      </Helmet>
      <ToDoInfo />
    </>
  );
};

export default TodoInfoPage;