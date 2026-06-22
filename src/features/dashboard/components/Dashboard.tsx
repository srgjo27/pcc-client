import React from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight gap-2">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
      </div>

      {/* TODO */}
    </div>
  );
};
