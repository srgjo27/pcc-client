import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useQuickAddTask, useQuickAddNote } from '../hooks';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { CheckSquare, StickyNote, Plus, Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export const QuickAddBar: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'TASK' | 'NOTE'>('TASK');
  const [taskTitle, setTaskTitle] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showNoteContent, setShowNoteContent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync: quickAddTask, isPending: isTaskPending } = useQuickAddTask();
  const { mutateAsync: quickAddNote, isPending: isNotePending } = useQuickAddNote();

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || isTaskPending) return;

    await quickAddTask({
      title: taskTitle.trim(),
      priority: 'MEDIUM',
      context: 'PERSONAL',
      status: 'TODO',
    });

    setTaskTitle('');
    triggerSuccess();
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || isNotePending) return;

    await quickAddNote({
      title: noteTitle.trim(),
      content: noteContent.trim() || undefined,
    });

    setNoteTitle('');
    setNoteContent('');
    setShowNoteContent(false);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const isPending = isTaskPending || isNotePending;

  return (
    <Card className="p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#26A69A]/10 text-[#26A69A]">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold tracking-tight text-slate-800">
            {t.dashboard.quickAddTitle}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('TASK')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all',
              activeTab === 'TASK'
                ? 'bg-white text-[#26A69A] shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>{t.dashboard.quickAddTaskTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NOTE')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all',
              activeTab === 'NOTE'
                ? 'bg-white text-[#26A69A] shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>{t.dashboard.quickAddNoteTab}</span>
          </button>
        </div>
      </div>

      {/* Form Input */}
      {activeTab === 'TASK' ? (
        <form onSubmit={handleTaskSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              id="quick-add-task-input"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t.dashboard.quickAddTaskPlaceholder}
              disabled={isPending}
              className="text-xs sm:text-sm h-10"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!taskTitle.trim() || isPending}
            isLoading={isTaskPending}
            className="h-10 px-4 shrink-0 font-semibold"
          >
            {isSuccess ? <Check className="h-4 w-4" /> : t.dashboard.quickAddSubmit}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleNoteSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="quick-add-note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                onFocus={() => setShowNoteContent(true)}
                placeholder={t.dashboard.quickAddNotePlaceholder}
                disabled={isPending}
                className="text-xs sm:text-sm h-10"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!noteTitle.trim() || isPending}
              isLoading={isNotePending}
              className="h-10 px-4 shrink-0 font-semibold"
            >
              {isSuccess ? <Check className="h-4 w-4" /> : t.dashboard.quickAddSubmit}
            </Button>
          </div>

          {showNoteContent && (
            <div className="pt-1">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t.dashboard.quickAddNoteContentPlaceholder}
                rows={2}
                disabled={isPending}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#26A69A]/30 focus:border-[#26A69A] resize-none transition-all"
              />
            </div>
          )}
        </form>
      )}
    </Card>
  );
};
