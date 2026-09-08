import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Brain, Coffee } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { FocusTask, FocusTimerSettings } from '../types';
import { formatDurationSeconds } from '@/shared/utils/date';

interface FocusTimerProps {
  mode: 'focus' | 'break';
  isRunning: boolean;
  secondsLeft: number | null;
  totalSeconds: number;
  settings?: FocusTimerSettings;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  timerError: string | null;
  setTimerError: (error: string | null) => void;
  activeTasks: FocusTask[];
  handleReset: () => void;
  handleToggleStart: () => void;
  handleSkip: () => void;
}


export const FocusTimer: React.FC<FocusTimerProps> = ({
  mode,
  isRunning,
  secondsLeft,
  totalSeconds,
  settings,
  selectedTaskId,
  setSelectedTaskId,
  timerError,
  setTimerError,
  activeTasks,
  handleReset,
  handleToggleStart,
  handleSkip,
}) => {
  const { t } = useLanguage();

  const percent = secondsLeft !== null ? (secondsLeft / totalSeconds) * 100 : 100;
  const radius = 110;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <main className="lg:col-span-8 space-y-6" aria-label="Timer Sesi Pomodoro">
      <Card className="flex flex-col items-center justify-center py-10 relative overflow-hidden">
        {/* Mode Badge */}
        <div
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold select-none mb-6 ${mode === 'focus'
            ? 'bg-[#E0F2F1] text-[#26A69A] border border-[#26A69A]'
            : 'bg-[#FFF7E9] text-[#FFB300] border border-[#FFB300]'
            }`}
        >
          {mode === 'focus' ? <Brain className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
          <span>{mode === 'focus' ? t.focus.modeFocus : t.focus.modeBreak}</span>
        </div>

        {/* Timer visual circle */}
        <div className="relative flex items-center justify-center mb-8">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Ring */}
            <circle
              stroke="#F1F5F9"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Countdown Ring */}
            <circle
              stroke={mode === 'focus' ? '#26A69A' : '#F59E0B'}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Text Timer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-bold tracking-tighter tabular-nums select-none"
              aria-live="polite"
            >
              {formatDurationSeconds(secondsLeft)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase mt-1 select-none">
              {mode === 'focus' ? t.focus.modeFocus : t.focus.modeBreak}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={
              !isRunning &&
              secondsLeft ===
              (mode === 'focus'
                ? (settings?.focusDuration ?? 25) * 60
                : (settings?.breakDuration ?? 5) * 60)
            }
            aria-label="Reset timer"
          >
            <RotateCcw className="h-5 w-5 text-slate-500" />
          </Button>

          <Button
            variant="custom"
            size="icon"
            onClick={handleToggleStart}
            aria-label="Pause"
            className={`h-14 w-14 text-white hover:scale-[1.04] active:scale-[0.96] ${mode === 'focus'
              ? isRunning
                ? 'bg-[#29B6F6] hover:bg-[#2196F3]'
                : 'bg-[#26A69A] hover:bg-[#22948B]'
              : isRunning
                ? 'bg-[#FBC02D] hover:bg-[#F4B200]'
                : 'bg-[#FFB300] hover:bg-[#F4B200]'
              }`}
          >
            {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white ml-0.5" />}
          </Button>

          <Button variant="outline" size="icon" onClick={handleSkip} aria-label="Skip Sesi">
            <SkipForward className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        {/* Select Active Task */}
        {mode === 'focus' && (
          <div className="w-full max-w-md px-6 space-y-4">
            <Select
              id="task-select"
              label={t.focus.activeTaskLabel}
              error={timerError || undefined}
              disabled={isRunning}
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value);
                setTimerError(null);
              }}
              options={[
                { value: '', label: t.focus.selectTaskPlaceholder },
                ...activeTasks.map((task) => ({ value: task.id, label: task.title })),
              ]}
              className="font-medium"
            />
          </div>
        )}
      </Card>
    </main>
  );
};
