import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';
import { focusTaskSchema } from '../schemas';
import {
  useGetFocusSettings,
  useGetFocusTasks,
  useCreateFocusTask,
  useGetFocusSessions,
  useCreateFocusSession,
  useGetFocusStats,
} from '../hooks';
import { FocusSettingsModal } from './FocusSettingsModal';
import { FocusStatsSidebar } from './FocusStatsSidebar';
import { FocusTimer } from './FocusTimer';

type TaskFormValues = z.infer<typeof focusTaskSchema>;

export const FocusMode: React.FC = () => {
  const { t } = useLanguage();

  const { data: settings } = useGetFocusSettings();
  const { data: tasks } = useGetFocusTasks();
  const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateFocusTask();
  const { data: sessions, isLoading: isSessionsLoading } = useGetFocusSessions();
  const { mutateAsync: createSession } = useCreateFocusSession();
  const { data: stats, isLoading: isStatsLoading } = useGetFocusStats();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [timerError, setTimerError] = useState<string | null>(null);

  const totalSeconds = settings
    ? (mode === 'focus' ? settings.focusDuration : settings.breakDuration) * 60
    : 25 * 60;

  const currentSecondsLeft = secondsLeft !== null ? secondsLeft : totalSeconds;
  const currentSecondsLeftRef = React.useRef(currentSecondsLeft);

  useEffect(() => {
    currentSecondsLeftRef.current = currentSecondsLeft;
  }, [currentSecondsLeft]);

  const handleTimerComplete = React.useCallback(async () => {
    setIsRunning(false);

    if (mode === 'focus') {
      const activeTask = tasks?.find((t) => t.id === selectedTaskId);
      const sessionDuration = settings ? settings.focusDuration : 25;

      await createSession({
        taskId: selectedTaskId || null,
        taskTitle: activeTask?.title || null,
        duration: sessionDuration,
        mode: 'focus',
      });

      alert(t.focus.alertSessionCompleted);
      setMode('break');
      setSecondsLeft(null);
    } else {
      alert(t.focus.alertBreakCompleted);
      setMode('focus');
      setSecondsLeft(null);
    }
  }, [mode, tasks, selectedTaskId, settings, createSession, t.focus.alertSessionCompleted, t.focus.alertBreakCompleted]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && currentSecondsLeftRef.current > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const val = prev !== null ? prev : totalSeconds;
          if (val <= 1) {
            if (interval) clearInterval(interval);
            handleTimerComplete();
            return 0;
          }
          return val - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, totalSeconds, handleTimerComplete]);

  const handleSkip = async () => {
    if (window.confirm('Apakah Anda ingin melompati sesi ini?')) {
      setIsRunning(false);
      if (mode === 'focus') {
        const activeTask = tasks?.find((t) => t.id === selectedTaskId);
        const sessionDuration = settings ? settings.focusDuration : 25;

        await createSession({
          taskId: selectedTaskId || null,
          taskTitle: activeTask?.title || null,
          duration: sessionDuration,
          mode: 'focus',
        });

        setMode('break');
        if (settings) {
          setSecondsLeft(settings.breakDuration * 60);
        }
      } else {
        setMode('focus');
        if (settings) {
          setSecondsLeft(settings.focusDuration * 60);
        }
      }
    }
  };

  const handleToggleStart = () => {
    if (mode === 'focus' && !selectedTaskId) {
      setTimerError(t.focus.noTaskSelected);
      return;
    }
    setTimerError(null);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin menyetel ulang pengatur waktu?')) {
      setIsRunning(false);
      setTimerError(null);
      if (settings) {
        const durationMin = mode === 'focus' ? settings.focusDuration : settings.breakDuration;
        setSecondsLeft(durationMin * 60);
      }
    }
  };

  const {
    register: registerTask,
    handleSubmit: handleSubmitTask,
    reset: resetTaskForm,
    formState: { errors: taskErrors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(focusTaskSchema),
  });

  const onAddTask = async (data: TaskFormValues) => {
    const newTask = await createTask(data.title);
    setSelectedTaskId(newTask.id);
    setTimerError(null);
    resetTaskForm();
  };

  const activeTasks = tasks?.filter((t) => !t.completed) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{t.focus.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.focus.subtitle}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Pengaturan Timer"
        >
          <Settings className="h-4 w-4" />
          <span>{t.focus.customizeTimer}</span>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timer & Task Selector */}
        <FocusTimer
          mode={mode}
          isRunning={isRunning}
          secondsLeft={currentSecondsLeft}
          totalSeconds={totalSeconds}
          settings={settings}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
          timerError={timerError}
          setTimerError={setTimerError}
          activeTasks={activeTasks}
          isCreatingTask={isCreatingTask}
          onAddTask={onAddTask}
          handleReset={handleReset}
          handleToggleStart={handleToggleStart}
          handleSkip={handleSkip}
          registerTask={registerTask}
          handleSubmitTask={handleSubmitTask}
          taskErrors={taskErrors}
        />

        {/* Right Column: Stats & Session History */}
        <FocusStatsSidebar
          stats={stats}
          isStatsLoading={isStatsLoading}
          sessions={sessions}
          isSessionsLoading={isSessionsLoading}
        />
      </div>

      {/* Modals */}
      <FocusSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
      />
    </div>
  );
};
