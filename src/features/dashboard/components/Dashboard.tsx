import { strings } from '@/constants/strings';
import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight gap-2">
            {strings.dashboard.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {strings.dashboard.subtitle}
          </p>
        </div>
      </div>

      {/* TODO */}
    </div>
  );
};
