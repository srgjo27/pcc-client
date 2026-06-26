import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { Habit } from '../types';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { getLocalDateString } from '../services';
import { cn } from '@/shared/utils/cn';
import { Check, HelpCircle, Trash2, Zap } from 'lucide-react';

interface HabitListItemProps {
  habit: Habit;
  onToggleCheckIn: (id: string, dateStr: string) => void;
  onDelete: (id: string) => void;
  isCheckingIn?: boolean;
}

export const HabitListItem: React.FC<HabitListItemProps> = ({
  habit,
  onToggleCheckIn,
  onDelete,
  isCheckingIn = false,
}) => {
  const { t, lang } = useLanguage();
  const todayStr = getLocalDateString();
  const isCheckedToday = !!habit.checkInHistory[todayStr];

  const handleDeleteClick = () => {
    if (window.confirm(t.habits.confirmDelete)) {
      onDelete(habit.id);
    }
  };

  const getFrequencyLabel = () => {
    if (habit.frequency === 'daily') {
      return t.habits.frequencyDaily;
    }

    const daysShort = lang === 'id'
      ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const activeDays = habit.frequencyDays.map(d => daysShort[d]);
    return activeDays.join(', ');
  };

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 border',
          isCheckedToday
            ? 'bg-[#F0F9FF] text-[#26A69A] border-[#B2DFDB]'
            : 'bg-slate-50 text-slate-500 border-neutral-200'
        )}>
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-xs sm:text-sm">
            {habit.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {getFrequencyLabel()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
        {/* Streak & Stats */}
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {t.habits.streakActive}
            </span>
            <span className="text-xs font-semibold flex items-center gap-1">
              <Zap className={cn("h-3 w-3 fill-[#FBC02D] stroke-[#FFB300] animate-pulse")} />
              {habit.streak} {t.habits.streak}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={isCheckedToday ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onToggleCheckIn(habit.id, todayStr)}
            isLoading={isCheckingIn}
            className={cn(
              "font-medium",
              isCheckedToday && "bg-[#26A69A] hover:bg-[#22948B] text-white"
            )}
          >
            {isCheckedToday ? (
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {lang == 'id' ? 'Selesai' : 'Done'}
              </span>
            ) : (
              'Check In'
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="text-slate-400 hover:text-red-500"
            title="Delete Habit"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
