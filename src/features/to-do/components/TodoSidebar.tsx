import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  User,
  CheckCircle2,
  Clock,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Context, Priority, Status, type Task } from '../types';

interface TodoSidebarProps {
  tasks?: Task[];
}

export const TodoSidebar: React.FC<TodoSidebarProps> = ({ tasks = [] }) => {
  const { t, lang } = useLanguage();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === Status.IN_PROGRESS).length,
    done: tasks.filter(t => t.status === Status.DONE).length
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const contexts = [
    { id: 'lecture', name: t.todo.aside.contexts.lecture, icon: GraduationCap, count: tasks.filter(t => t.context === Context.LECTURE).length, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/80' },
    { id: 'work', name: t.todo.aside.contexts.work, icon: Briefcase, count: tasks.filter(t => t.context === Context.WORK).length, color: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/80' },
    { id: 'business', name: t.todo.aside.contexts.business, icon: TrendingUp, count: tasks.filter(t => t.context === Context.BUSINESS).length, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/80' },
    { id: 'personal', name: t.todo.aside.contexts.personal, icon: User, count: tasks.filter(t => t.context === Context.PERSONAL).length, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/80' },
  ];

  const priorities = [
    {
      id: Priority.LOW,
      name: t.todo.aside.priorities.low,
      count: tasks.filter(t => t.priority === Priority.LOW).length,
      color: 'text-slate-600 bg-slate-50 border-slate-100',
      dot: 'bg-slate-400',
    },
    {
      id: Priority.MEDIUM,
      name: t.todo.aside.priorities.medium,
      count: tasks.filter(t => t.priority === Priority.MEDIUM).length,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      dot: 'bg-amber-500',
    },
    {
      id: Priority.HIGH,
      name: t.todo.aside.priorities.high,
      count: tasks.filter(t => t.priority === Priority.HIGH).length,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      dot: 'bg-orange-500',
    },
    {
      id: Priority.URGENT,
      name: t.todo.aside.priorities.urgent,
      count: tasks.filter(t => t.priority === Priority.URGENT).length,
      color: 'text-red-600 bg-red-50 border-red-100',
      dot: 'bg-red-500',
    },
  ];

  return (
    <aside className="lg:col-span-4 space-y-6" aria-label="Metadata Tugas">
      {/* Today Review Section */}
      <Card className="overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#26A69A] to-[#29B6F6]" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#26A69A]" />
            <CardTitle className="text-sm font-semibold">
              {lang === 'id' ? 'Tinjauan Hari Ini' : "Today's Review"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>{lang === 'id' ? 'Tingkat Penyelesaian' : 'Completion Rate'}</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#26A69A] to-[#29B6F6] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'id' ? `${stats.done} dari ${stats.total} tugas selesai` : `${stats.done} of ${stats.total} tasks completed`}
            </p>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg bg-[#FFF8E1] p-3 flex items-center gap-2 border border-neutral-100">
              <div className="p-1 rounded-md bg-[#FFECB3]">
                <Clock className="h-4 w-4 text-[#FFB300]" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-500">{lang === 'id' ? 'Sedang Dikerjakan' : 'In Progress'}</p>
                <p className="text-base font-bold">{stats.inProgress}</p>
              </div>
            </div>
            <div className="rounded-lg bg-[#26A69A]/10 p-3 flex items-center gap-2 border border-neutral-100">
              <div className="p-1 rounded-md bg-[#26A69A]/20">
                <CheckCircle2 className="h-4 w-4 text-[#26A69A]" />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-500">{lang === 'id' ? 'Selesai' : 'Done'}</p>
                <p className="text-base font-bold">{stats.done}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {t.todo.aside.contextTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-neutral-100">
            {contexts.map((ctx) => {
              const Icon = ctx.icon;
              const isSelected = selectedContext === ctx.id;

              return (
                <button
                  key={ctx.id}
                  type="button"
                  onClick={() => setSelectedContext(!isSelected ? ctx.id : null)}
                  className={`w-full flex items-center justify-between p-3 text-left text-xs font-medium transition-all 
                    hover:bg-slate-50 focus:bg-slate-50 outline-hidden
                    ${isSelected ? 'bg-slate-50/80 font-bold border-l-4 border-[#26A69A] pl-2.5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${ctx.color} transition-colors`}>
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <span>{ctx.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold">
                      {ctx.count}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Priority Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            {t.todo.aside.priorityTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-neutral-100">
            {priorities.map((prio) => {
              const isSelected = selectedPriority === prio.id;

              return (
                <button
                  key={prio.id}
                  type="button"
                  onClick={() => setSelectedPriority(!isSelected ? prio.id : null)}
                  className={`w-full flex items-center justify-between p-3 text-left text-xs font-medium transition-all 
                    hover:bg-slate-50 focus:bg-slate-50 outline-hidden 
                    ${isSelected ? 'bg-slate-50/80 font-bold border-l-4 border-[#26A69A] pl-2.5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${prio.dot}`} />
                    <span>{prio.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${prio.color}`}>
                      {prio.count}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};
