import { ToDo } from '@/features/to-do';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const TodoPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Lacak Tugas | PCC Client</title>
        <meta name="description" content="Manajemen tugas harian berdasarkan konteks Kuliah, Kerja, Usaha, dan Personal dengan prioritasi dan visualisasi deadline." />
      </Helmet>
      <ToDo />
    </>
  );
};

export default TodoPage;