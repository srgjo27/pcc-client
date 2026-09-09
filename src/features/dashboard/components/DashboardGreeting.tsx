import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { formatDateShort } from '@/shared/utils/date';
import { Sun, Moon, Sunrise, Sunset, Sparkles } from 'lucide-react';

export const DashboardGreeting: React.FC = () => {
  const { t, lang } = useLanguage();

  const now = new Date();
  const currentHour = now.getHours();

  let greetingText = t.dashboard.greetingMorning;
  let IconComponent = Sunrise;
  let iconColor = 'text-amber-500';

  if (currentHour >= 11 && currentHour < 15) {
    greetingText = t.dashboard.greetingAfternoon;
    IconComponent = Sun;
    iconColor = 'text-yellow-500';
  } else if (currentHour >= 15 && currentHour < 19) {
    greetingText = t.dashboard.greetingEvening;
    IconComponent = Sunset;
    iconColor = 'text-orange-500';
  } else if (currentHour >= 19 || currentHour < 5) {
    greetingText = t.dashboard.greetingNight;
    IconComponent = Moon;
    iconColor = 'text-indigo-400';
  }

  const dateFormatted = formatDateShort(now.toISOString(), lang as 'id' | 'en');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-[#26A69A]/10 via-[#29B6F6]/10 to-transparent p-5 rounded-2xl border border-neutral-200">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-neutral-200">
          <IconComponent className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              {greetingText}!
            </h1>
            <Sparkles className="h-4 w-4 text-[#26A69A]" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.dashboard.greetingSub}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-white/80 border border-neutral-200 shadow-2xs">
        <span className="h-2 w-2 rounded-full bg-[#26A69A] animate-pulse" />
        <span className="text-xs font-semibold text-slate-700">
          {dateFormatted}
        </span>
      </div>
    </div>
  );
};
