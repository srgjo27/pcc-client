import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import { useTasks } from '../hooks';
import { TaskList } from './TaskList';
import { TodoSidebar } from './TodoSidebar';
import { AddTaskModal } from './AddTaskModal';

export const ToDo: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: tasks, isLoading } = useTasks();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight gap-2">
            {t.todo.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.todo.subtitle}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 font-semibold hover:scale-[1.02] active:scale-[0.98]"
          aria-label={t.todo.addAriaLabel}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>{t.todo.addButton}</span>
        </Button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content */}
        <TaskList
          loading={isLoading}
          tasks={tasks || []}
          onSelectTask={(id) => navigate(`/to-do/${id}`)}
        />

        {/* Sidebar / Aside (Right) */}
        <TodoSidebar tasks={tasks || []} />
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};