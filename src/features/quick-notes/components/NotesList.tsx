import React from 'react';
import { Pin, Notebook, LoaderCircle } from 'lucide-react';
import type { Note } from '@/features/quick-notes/types';
import { NoteListItem } from './NoteListItem';

export interface NotesListProps {
  isLoadingNotes: boolean;
  filteredNotes: Note[];
  pinnedNotes: Note[];
  otherNotes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  handleTogglePin: (note: Note, e: React.MouseEvent) => void;
  handleDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  tasks: Array<{ id: string; title: string; context: string }>;
  getContextBg: (context?: string) => string;
  lang: string;
  t: {
    notes: {
      pinned: string;
      otherNotes: string;
      emptyNotes: string;
      emptyNotesDesc: string;
    };
  };
}

export const NotesList: React.FC<NotesListProps> = ({
  isLoadingNotes,
  filteredNotes,
  pinnedNotes,
  otherNotes,
  activeNoteId,
  setActiveNoteId,
  handleTogglePin,
  handleDeleteNote,
  tasks,
  getContextBg,
  lang,
  t,
}) => {
  if (isLoadingNotes) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <LoaderCircle className="h-6 w-6 animate-spin text-[#26A69A]" />
        <span className="text-xs text-slate-400">
          {lang === 'id' ? 'Mengambil catatan...' : 'Loading notes...'}
        </span>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="rounded-full bg-slate-50 p-3 inline-block mb-2">
          <Notebook className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-xs font-semibold">{t.notes.emptyNotes}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{t.notes.emptyNotesDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
      {/* Pinned section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Pin className="h-3 w-3 rotate-45" />
            <span>{t.notes.pinned}</span>
          </div>
          {pinnedNotes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => setActiveNoteId(note.id)}
              onTogglePin={(e) => handleTogglePin(note, e)}
              onDelete={(e) => handleDeleteNote(note.id, e)}
              tasks={tasks}
              getContextBg={getContextBg}
            />
          ))}
        </div>
      )}

      {/* Other notes section */}
      {otherNotes.length > 0 && (
        <div className="space-y-2 pt-1">
          {pinnedNotes.length > 0 && (
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t.notes.otherNotes}
            </div>
          )}
          {otherNotes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => setActiveNoteId(note.id)}
              onTogglePin={(e) => handleTogglePin(note, e)}
              onDelete={(e) => handleDeleteNote(note.id, e)}
              tasks={tasks}
              getContextBg={getContextBg}
            />
          ))}
        </div>
      )}
    </div>
  );
};
