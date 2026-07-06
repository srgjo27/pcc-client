import React from 'react';
import { Briefcase, GraduationCap, ListTodo, TrendingUp, User } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/Card';
import type { Task } from '../types';
import { Context, Priority } from '../types';
import { formatToDateLocal } from '@/shared/utils/date';
import { Loading } from '@/shared/components/ui/Loading';

const contexts = [
  { id: Context.LECTURE, icon: GraduationCap, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/80' },
  { id: Context.WORK, icon: Briefcase, color: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/80' },
  { id: Context.BUSINESS, icon: TrendingUp, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/80' },
  { id: Context.PERSONAL, icon: User, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/80' },
];

const priorities = [
  { id: Priority.LOW, dot: 'bg-slate-400' },
  { id: Priority.MEDIUM, dot: 'bg-amber-500' },
  { id: Priority.HIGH, dot: 'bg-orange-500' },
  { id: Priority.URGENT, dot: 'bg-red-500' },
];

interface TaskListProps {
  loading: boolean;
  tasks?: Task[];
  onSelectTask?: (id: string) => void;
}

interface TaskListContentProps {
  loading: boolean;
  tasks: Task[];
  onSelectTask?: (id: string) => void;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
}

const TaskListContent: React.FC<TaskListContentProps> = ({
  loading,
  tasks,
  onSelectTask,
  emptyStateTitle,
  emptyStateSubtitle
}) => {
  if (loading) {
    return <Loading />;
  }

  if (tasks.length !== 0) {
    return (
      <div className="flex flex-col bg-[#26A69A]/10 items-center justify-center py-8 text-center">
        <div className="p-4">
          <ListTodo className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium">{emptyStateTitle}</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          {emptyStateSubtitle}
        </p>
      </div>
    );
  }

  return (
    <>
      {tasks.map((task) => {
        const matchedContext = contexts.find((c) => c.id === task.context);
        const ContextIcon = matchedContext?.icon;
        const priority = priorities.find((p) => p.id === task.priority);

        const handleTaskClick = () => {
          if (onSelectTask) {
            onSelectTask(task.id);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTaskClick();
          }
        };

        return (
          <div
            key={task.id}
            role="button"
            tabIndex={0}
            onClick={handleTaskClick}
            onKeyDown={handleKeyDown}
            className="mb-3 p-3 rounded-lg border border-neutral-100 cursor-pointer hover:border-teal-400"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                {ContextIcon && (
                  <div className={`p-2 rounded-lg border ${matchedContext.color}`}>
                    <ContextIcon className="h-4 w-4 shrink-0" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-[10px] text-slate-500">Deadline: {task.dueDate ? formatToDateLocal(task.dueDate) : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${priority?.dot}`} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const TaskList: React.FC<TaskListProps> = ({
  loading,
  tasks = [],
  onSelectTask
}) => {
  const { t } = useLanguage();

  return (
    <main className="lg:col-span-8 space-y-6" aria-label="Daftar Tugas Aktif">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t.todo.activeTasksTitle}</CardTitle>
          <CardDescription>{t.todo.activeTasksSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskListContent
            loading={loading}
            tasks={tasks}
            onSelectTask={onSelectTask}
            emptyStateTitle={t.todo.emptyStateTitle}
            emptyStateSubtitle={t.todo.emptyStateSubtitle}
          />
        </CardContent>
      </Card>
    </main>
  );
};
