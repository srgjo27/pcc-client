import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { Button } from '@/shared/components/ui/Button';

interface SidebarControlsProps {
  activeContexts: string[];
  onToggleContext: (ctx: string) => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  activeContexts,
  onToggleContext,
}) => {
  const { lang } = useLanguage();

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4 border border-neutral-300 rounded-xl p-4 bg-white">
      <Button
        size="sm"
        className="gap-2 font-semibold hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        <span>{lang === 'id' ? 'Tambah Jadwal Baru' : 'Create New Schedule'}</span>
      </Button>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          <span>FILTER</span>
        </div>

        <div className="flex flex-col gap-2">
          {(['LECTURE', 'WORK', 'BUSINESS', 'PERSONAL', 'GYM'] as const).map((ctx) => (
            <label
              key={ctx}
              className="flex items-center gap-2 p-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={activeContexts.includes(ctx)}
                onChange={() => onToggleContext(ctx)}
                className="h-4.5 w-4.5 accent-[#FFB300]"
              />
              <span className="text-xs font-semibold first-letter:uppercase">
                {ctx.toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Conflict Warning Indicator */}
      {/* {hasConflictInView && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-[11px] font-semibold animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">{t.schedule.conflictWarningTitle}</p>
            <p className="text-red-700 font-medium">{t.schedule.conflictWarningDesc}</p>
          </div>
        </div>
      )} */}
    </aside>
  );
};

export default SidebarControls;
