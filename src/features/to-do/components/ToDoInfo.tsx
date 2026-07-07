import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipboardClock, Clock, Frown, Timer, Trash } from 'lucide-react';
import { useRemoveTask, useTaskInformation } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Loading } from '@/shared/components/ui/Loading';
import { formatToDateLocal } from '@/shared/utils/date';
import { Priority, type Task } from '../types';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';

interface ToDoInfoContentProps {
  isLoading: boolean;
  task?: Task;
  priorities: { id: Priority; dot: string }[];
  lang: string;
}

const ToDoInfoContent: React.FC<ToDoInfoContentProps> = ({
  isLoading,
  task,
  priorities,
  lang,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!task) {
    return (
      <div className="h-50 border border-neutral-300 rounded-xl flex flex-col items-center justify-center">
        <div className="p-4">
          <Frown className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium">{lang === 'id' ? 'Tugas tidak ditemukan' : 'Task not found'}</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          {lang === 'id' ? 'Tugas yang kamu cari tidak ditemukan.' : 'The task you are looking for was not found.'}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${priorities.find(p => p.id === task.priority)?.dot}`} />
            <span className="text-xs font-medium">
              {task.priority}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Deskripsi</h3>
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
            {task.description || 'Tidak ada deskripsi untuk tugas ini.'}
          </p>
        </div>
        <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-slate-500">
          <div>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <span key={tag} className="bg-slate-100 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Created At: {formatToDateLocal(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardClock className="h-3.5 w-3.5" />
              <span>Deadline: {formatToDateLocal(task.dueDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-3.5 w-3.5" />
              <span>Time: -</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ToDoInfo: React.FC = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useTaskInformation(id!);
  const { mutate: deleteMutate } = useRemoveTask();

  const priorities = [
    { id: Priority.LOW, dot: 'bg-slate-400' },
    { id: Priority.MEDIUM, dot: 'bg-amber-500' },
    { id: Priority.HIGH, dot: 'bg-orange-500' },
    { id: Priority.URGENT, dot: 'bg-red-500' },
  ];

  const handleDelete = () => {
    deleteMutate(id!);
    navigate(-1);
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{lang === 'id' ? "Detail Tugas" : "Task Detail"}</h1>
          <p className="text-xs text-slate-500">{lang === 'id' ? "Lihat informasi lengkap dari tugas Anda" : "View complete information of your task"}</p>
        </div>
        <div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="font-semibold gap-2"
          >
            <Trash className="h-3 w-3" />
            {lang === 'id' ? 'Hapus' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Section */}
      <ToDoInfoContent
        isLoading={isLoading}
        task={task}
        priorities={priorities}
        lang={lang}
      />
    </div>
  );
};
