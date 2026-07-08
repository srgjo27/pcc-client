import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import SidebarControls from './SidebarControls';
import CalendarArea from './CalendarArea';
import EventModal from './EventModal';

export const ScheduleView: React.FC = () => {
  const { t, lang } = useLanguage();
  const [activeContexts, setActiveContexts] = useState<string[]>([
    'LECTURE',
    'WORK',
    'BUSINESS',
    'PERSONAL',
    'GYM',
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleContext = (ctx: string) => {
    setActiveContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{t.schedule.title}</h1>
          <p className="text-slate-500 text-sm">{t.schedule.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Controls */}
        <SidebarControls
          activeContexts={activeContexts}
          onToggleContext={handleToggleContext}
          setIsModalOpen={setIsModalOpen}
        />

        {/* Calendar Area */}
        <CalendarArea activeContexts={activeContexts} />
      </div>

      {/* Modals */}
      <EventModal
        lang={lang}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ScheduleView;
