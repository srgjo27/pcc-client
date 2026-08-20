import React from 'react';
import { Search, Plus } from 'lucide-react';
import type { Note } from '@/features/quick-notes/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { NotesList } from './NotesList';
import { useLanguage } from '@/shared/hooks/useLanguage';

export interface NotesSidebarProps {
  handleCreateNote: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
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
}

export const NotesSidebar: React.FC<NotesSidebarProps> = ({
  handleCreateNote,
  searchQuery,
  setSearchQuery,
  allTags,
  selectedTag,
  setSelectedTag,
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
}) => {
  const { t, lang } = useLanguage();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">{t.notes.title}</CardTitle>
        <Button
          size="custom"
          onClick={handleCreateNote}
          className="font-semibold text-xs px-3 py-1.5 rounded-lg gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.notes.addNote}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search Bar */}
        <Input
          placeholder={t.notes.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label='Cari catatan'
          leftElement={<Search className="h-3.5 w-3.5 text-slate-400" />}
        />

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Button
              variant="custom"
              size="custom"
              onClick={() => setSelectedTag(null)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${!selectedTag
                ? 'bg-[#E0F2FE] text-[#26A69A] border-[#26A69A]'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
            >
              {lang === 'id' ? 'Semua' : 'All'}
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant="custom"
                size="custom"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${selectedTag === tag
                  ? 'bg-[#E0F2FE] text-[#26A69A] border-[#26A69A]'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}

        {/* Notes List */}
        <NotesList
          isLoadingNotes={isLoadingNotes}
          filteredNotes={filteredNotes}
          pinnedNotes={pinnedNotes}
          otherNotes={otherNotes}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          handleTogglePin={handleTogglePin}
          handleDeleteNote={handleDeleteNote}
          tasks={tasks}
          getContextBg={getContextBg}
          lang={lang}
          t={t}
        />
      </CardContent>
    </Card>
  );
};
