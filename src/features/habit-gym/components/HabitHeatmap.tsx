import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { cn } from '@/shared/utils/cn';
import { formatToDateLocal, WEEKDAYS_SHORT, WEEKDAYS_SHORT_ID } from '@/shared/utils/date';

interface HabitHeatmapProps {
  checkInHistory: Record<string, boolean>;
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ checkInHistory }) => {
  const { t, lang } = useLanguage();

  const today = new Date();
  const dates: Date[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }

  const getWeekDays = () => {
    return (lang === 'id' ? WEEKDAYS_SHORT_ID : WEEKDAYS_SHORT);
  };

  const weekdays = getWeekDays();

  const todayDayOfWeek = today.getDay();
  const totalSlotsNeeded = 91;
  const gridStartDate = new Date(today);
  gridStartDate.setDate(today.getDate() - (totalSlotsNeeded - 1 - todayDayOfWeek));

  const gridSlots: (Date | null)[] = [];

  for (let i = 0; i < totalSlotsNeeded; i++) {
    const d = new Date(gridStartDate);
    d.setDate(gridStartDate.getDate() + i);

    const diffTime = today.getTime() - d.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 90 && d <= today) {
      gridSlots.push(d);
    } else {
      gridSlots.push(null);
    }
  }

  const columns: (Date | null)[][] = [];
  for (let i = 0; i < 13; i++) {
    columns.push(gridSlots.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-300 bg-white p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider">
        {t.habits.heatmapTitle}
      </h3>

      <div className="flex gap-1 overflow-x-auto scrollbar-thin">
        {/* Weekday labels */}
        <div>
          <div className="grid grid-rows-7 gap-1 text-[10px] font-medium text-slate-400">
            <span className="h-3.5 flex items-center leading-none">{weekdays[0]}</span>
            <span className="h-3.5" />
            <span className="h-3.5 flex items-center leading-none">{weekdays[2]}</span>
            <span className="h-3.5" />
            <span className="h-3.5 flex items-center leading-none">{weekdays[4]}</span>
            <span className="h-3.5" />
            <span className="h-3.5 flex items-center leading-none">{weekdays[6]}</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="grid grid-rows-7 gap-1">
              {col.map((date, rowIdx) => {
                if (!date) {
                  return (
                    <div
                      key={rowIdx}
                      className="h-3.5 w-3.5 rounded-sm bg-slate-50 border border-neutral-100"
                    />
                  );
                }

                const dateStr = formatToDateLocal(date);
                const isChecked = !!checkInHistory[dateStr];

                return (
                  <div
                    key={rowIdx}
                    title={`${date.toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}: ${isChecked ? 'Completed' : 'Missed'}`}
                    className={cn(
                      'h-3.5 w-3.5 rounded-sm transition-all duration-150',
                      isChecked
                        ? 'bg-[#26A69A] hover:scale-110'
                        : 'bg-slate-100 border border-neutral-200 hover:bg-slate-200'
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-500 self-end mt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-slate-100 border border-neutral-200" />
          <span>{lang === 'id' ? 'Belum Selesai / Tidak Aktif' : 'Missed / Not Active'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-[#26A69A]" />
          <span>{lang === 'id' ? 'Selesai' : 'Completed'}</span>
        </div>
      </div>
    </div>
  );
};
