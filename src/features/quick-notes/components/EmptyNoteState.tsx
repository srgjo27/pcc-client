import React from 'react';
import { Notebook, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export interface EmptyNoteStateProps {
  lang: string;
  onCreateNote: () => void;
}

export const EmptyNoteState: React.FC<EmptyNoteStateProps> = ({
  lang,
  onCreateNote,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-300 rounded-2xl bg-slate-50/50">
      <div className="rounded-full bg-slate-100 p-4 mb-4 text-[#26A69A]">
        <Notebook className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold">
        {lang === 'id' ? 'Catatan Belum Terpilih' : 'No Note Selected'}
      </h3>
      <p className="text-xs text-slate-500 max-w-xs mt-1">
        {lang === 'id'
          ? 'Pilih salah satu catatan dari daftar di samping untuk membacanya, atau buat catatan baru untuk menuangkan ide Anda.'
          : 'Select a note from the list on the side to read it, or create a new note to jot down your ideas.'}
      </p>
      <Button
        size="custom"
        className="mt-5 font-semibold text-xs py-2 px-4 rounded-lg gap-1.5"
        onClick={onCreateNote}
      >
        <Plus className="h-4 w-4" />
        <span>{lang === 'id' ? 'Buat Catatan Pertama' : 'Create First Note'}</span>
      </Button>
    </div>
  );
};
