import { strings } from '@/constants/strings';
import React, { useState } from 'react';
import {
    GraduationCap,
    Briefcase,
    TrendingUp,
    User,
    CheckCircle2,
    Clock,
    ChevronRight,
    ListTodo,
    CalendarDays,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';

export const ToDo: React.FC = () => {
    // Mock state for filters and stats to make UI dynamic
    const [selectedContext, setSelectedContext] = useState<string | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Mock stats
    const stats = {
        total: 10,
        completed: 6,
        pending: 4,
    };
    const completionPercentage = Math.round((stats.completed / stats.total) * 100);

    const contexts = [
        { id: 'college', name: strings.todo.aside.contexts.college, icon: GraduationCap, count: 3, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/80' },
        { id: 'work', name: strings.todo.aside.contexts.work, icon: Briefcase, count: 4, color: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100/80' },
        { id: 'business', name: strings.todo.aside.contexts.business, icon: TrendingUp, count: 2, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/80' },
        { id: 'personal', name: strings.todo.aside.contexts.personal, icon: User, count: 1, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/80' },
    ];

    const priorities = [
        { id: 'high', name: strings.todo.aside.priorities.high, count: 2, color: 'text-rose-600 bg-rose-50 border-rose-100', dot: 'bg-rose-500' },
        { id: 'medium', name: strings.todo.aside.priorities.medium, count: 5, color: 'text-amber-600 bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
        { id: 'low', name: strings.todo.aside.priorities.low, count: 3, color: 'text-slate-600 bg-slate-50 border-slate-100', dot: 'bg-slate-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-bold tracking-tight gap-2">
                        {strings.todo.title}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {strings.todo.subtitle}
                    </p>
                </div>
                <Button
                    type="button"
                    size="sm"
                    className="gap-2 !bg-[#26A69A] hover:!bg-[#23968b] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label={strings.todo.addAriaLabel}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    <span>{strings.todo.addButton}</span>
                </Button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Main Content Area (Left/Center) */}
                <main className="lg:col-span-8 space-y-6" aria-label="Daftar Tugas">
                    <Card className="hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">{strings.todo.activeTasksTitle}</CardTitle>
                                <CardDescription>{strings.todo.activeTasksSubtitle}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-slate-50 p-4 mb-4">
                                    <ListTodo className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-medium">{strings.todo.emptyStateTitle}</h3>
                                <p className="text-xs text-slate-500 max-w-xs mt-1">
                                    {strings.todo.emptyStateSubtitle}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </main>

                {/* Sidebar / Aside (Right) */}
                <aside className="lg:col-span-4 space-y-6" aria-label="Metadata Tugas">

                    {/* Today Review Section */}
                    <Card className="overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#26A69A] to-[#29B6F6]" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-[#26A69A]" />
                                <CardTitle className="text-sm font-semibold">
                                    {strings.todo.aside.reviewTitle}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Circular/Linear Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-600">
                                    <span>{strings.todo.aside.stats.completionRate}</span>
                                    <span>{completionPercentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-[#26A69A] to-[#29B6F6] rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    {strings.todo.aside.stats.tasksCount
                                        .replace('{completed}', String(stats.completed))
                                        .replace('{total}', String(stats.total))}
                                </p>
                            </div>

                            {/* Mini Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="rounded-lg bg-[#F0F9FF] p-3 flex items-center gap-2.5 border border-neutral-100">
                                    <div className="p-1 rounded-md bg-[#E0F2FE]">
                                        <CheckCircle2 className="h-4 w-4 text-[#26A69A]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-500">{strings.todo.aside.stats.completed}</p>
                                        <p className="text-base font-bold">{stats.completed}</p>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-amber-50/50 p-3 flex items-center gap-2.5 border border-slate-100">
                                    <div className="p-1 rounded-md bg-amber-100/50">
                                        <Clock className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-500">{strings.todo.aside.stats.pending}</p>
                                        <p className="text-base font-bold">{stats.pending}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Context Filter Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                {strings.todo.aside.contextTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-100">
                                {contexts.map((ctx) => {
                                    const Icon = ctx.icon;
                                    const isSelected = selectedContext === ctx.id;
                                    return (
                                        <button
                                            key={ctx.id}
                                            type="button"
                                            onClick={() => setSelectedContext(isSelected ? null : ctx.id)}
                                            className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-medium transition-all hover:bg-slate-50 focus:bg-slate-50 outline-hidden ${isSelected ? 'bg-slate-50/80 font-bold border-l-4 border-[#26A69A] pl-2.5' : ''
                                                }`}
                                            aria-label={`Filter berdasarkan konteks ${ctx.name}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg border ${ctx.color} transition-colors`}>
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                </div>
                                                <span>{ctx.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                    {ctx.count}
                                                </span>
                                                <ChevronRight className="h-3 w-3 text-slate-400" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Priority Filter Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                {strings.todo.aside.priorityTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-100">
                                {priorities.map((prio) => {
                                    const isSelected = selectedPriority === prio.id;
                                    return (
                                        <button
                                            key={prio.id}
                                            type="button"
                                            onClick={() => setSelectedPriority(isSelected ? null : prio.id)}
                                            className={`w-full flex items-center justify-between p-3.5 text-left text-xs font-medium transition-all hover:bg-slate-50 focus:bg-slate-50 outline-hidden ${isSelected ? 'bg-slate-50/80 font-bold border-l-4 border-[#26A69A] pl-2.5' : ''
                                                }`}
                                            aria-label={`Filter berdasarkan prioritas ${prio.name}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${prio.dot}`} />
                                                <span>{prio.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${prio.color}`}>
                                                    {prio.count}
                                                </span>
                                                <ChevronRight className="h-3 w-3 text-slate-400" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {/* Add Task Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={strings.todo.addButton}
                description={strings.todo.modalDescription}
            >
                <div className="space-y-4 py-2">
                    <p className="text-sm text-slate-600">{strings.todo.modalPlaceholder}</p>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsAddModalOpen(false)} 
                            size="sm"
                        >
                            {strings.todo.cancelButton}
                        </Button>
                        <Button 
                            size="sm" 
                            className="!bg-[#26A69A] hover:!bg-[#23968b] text-white" 
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            {strings.todo.saveButton}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}