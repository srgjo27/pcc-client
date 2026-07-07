import React from 'react';
import { Pin, Trash2 } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { formatDateShort } from '@/shared/utils/date';
import type { Note } from '@/features/quick-notes/types';
import { Button } from '@/shared/components/ui/Button';

export interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  tasks: Array<{ id: string; title: string; context: string }>;
  getContextBg: (context?: string) => string;
}

export const NoteListItem: React.FC<NoteListItemProps> = ({
  note,
  isActive,
  onClick,
  onTogglePin,
  onDelete,
  tasks,
  getContextBg,
}) => {
  const { lang } = useLanguage();
  const attachedTask = tasks.find((t) => t.id === note.taskId);
  const formattedDate = formatDateShort(note.updatedAt, lang);

  return (
    <div
      className={`group w-full relative rounded-lg border transition-all flex flex-col gap-2 ${isActive
        ? 'bg-[#F0F9FF] border-[#26A69A]'
        : 'border-neutral-200 hover:border-neutral-300 hover:bg-slate-50/50'
        }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left p-3.5 flex flex-col gap-2 rounded-xl focus:outline-hidden"
        aria-label={`Pilih catatan: ${note.title}`}
      >
        <div className="flex items-start justify-between gap-4 w-full pr-14">
          <h4 className="font-semibold text-xs truncate max-w-37.5">
            {note.title}
          </h4>
        </div>

        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
          {note.content && note.content.replace(/[#*`-]/g, '').trim()}
        </p>

        {attachedTask && (
          <div className={`self-start text-[9px] font-bold px-2 py-0.5 rounded-sm border ${getContextBg(attachedTask.context)}`}>
            {lang === 'id' ? `Tugas: ${attachedTask.title}` : `Task: ${attachedTask.title}`}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 w-full">
          <span className="text-[9px] text-slate-400 font-medium">{formattedDate}</span>
          {note.tags.length > 0 && (
            <div className="flex gap-1 overflow-hidden max-w-30">
              {note.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 font-bold rounded-sm bg-slate-50 text-slate-500 border border-slate-100 truncate"
                >
                  {t}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-[9px] px-1.5 py-0.5 font-bold rounded-sm bg-slate-50 text-slate-400 border border-slate-100">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Actions container - absolutely positioned to avoid nesting buttons */}
      <div className="absolute right-3.5 top-3.5 flex items-center gap-1 z-10">
        <Button
          variant="custom"
          size="custom"
          onClick={onTogglePin}
          className={`p-1 rounded-md ${note.isPinned
            ? 'text-[#FFB300] bg-[#FFF5E6]'
            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100 opacity-0 group-hover:opacity-100'
            }`}
          aria-label={note.isPinned ? 'Lepas Sematan' : 'Sematkan Catatan'}
        >
          <Pin className={`h-3 w-3 ${!note.isPinned && 'rotate-45'}`} />
        </Button>
        <Button
          variant="custom"
          size="custom"
          onClick={onDelete}
          className="p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100"
          aria-label="Hapus Catatan"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
