import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { useGetNotes, useGetTasks, useCreateNote, useUpdateNote, useDeleteNote } from '@/features/quick-notes/hooks';
import { noteSchema } from '@/features/quick-notes/schemas';
import type { Note, NoteInput } from '@/features/quick-notes/types';
import { NotesSidebar } from './NotesSidebar';
import { EmptyNoteState } from './EmptyNoteState';
import { NoteEditor } from './NoteEditor';

export const QuickNotes: React.FC = () => {
  const { t, lang } = useLanguage();

  // Queries
  const { data: notes = [], isLoading: isLoadingNotes } = useGetNotes();
  const { data: tasks = [] } = useGetTasks();

  // Mutations
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  // Component states
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [newTagInput, setNewTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const handleSelectNote = (id: string | null) => {
    setActiveNoteId(id);
    setSaveStatus('idle');
  };

  const { register, control, setValue, reset, formState: { isDirty } } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      isPinned: false,
      taskId: '',
    }
  });

  const titleValue = useWatch({ control, name: 'title' });
  const contentValue = useWatch({ control, name: 'content' });
  const taskIdValue = useWatch({ control, name: 'taskId' });
  const watchedTags = useWatch({ control, name: 'tags' });
  const tagsValue = useMemo(() => watchedTags || [], [watchedTags]);

  useEffect(() => {
    if (activeNote) {
      reset({
        title: activeNote.title,
        content: activeNote.content,
        tags: activeNote.tags,
        isPinned: activeNote.isPinned,
        taskId: activeNote.taskId || '',
      });
    } else {
      reset({
        title: '',
        content: '',
        tags: [],
        isPinned: false,
        taskId: '',
      });
    }
  }, [activeNote, reset]);

  useEffect(() => {
    if (!activeNoteId || !isDirty) return;

    const timer = setTimeout(() => {
      setSaveStatus('saving');
      updateNoteMutation.mutate(
        {
          id: activeNoteId,
          input: {
            title: titleValue,
            content: contentValue,
            taskId: taskIdValue || undefined,
            tags: tagsValue,
          },
        },
        {
          onSuccess: () => {
            setSaveStatus('saved');
            reset(
              {
                title: titleValue,
                content: contentValue,
                taskId: taskIdValue,
                tags: tagsValue,
              },
              { keepValues: true }
            );
          },
          onError: () => {
            setSaveStatus('error');
          },
        }
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [titleValue, contentValue, taskIdValue, tagsValue, activeNoteId, isDirty, reset, updateNoteMutation]);

  const insertFormat = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (formatType) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `\n# ${selectedText || 'Heading'}\n`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'code':
        replacement = `\n\`\`\`javascript\n${selectedText || 'code'}\n\`\`\`\n`;
        break;
      default:
        return;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue('content', newValue, { shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cleanTag = newTagInput.trim();
      if (cleanTag && !tagsValue.includes(cleanTag)) {
        const updatedTags = [...tagsValue, cleanTag];
        setValue('tags', updatedTags, { shouldDirty: true });
        setNewTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tagsValue.filter((t) => t !== tagToRemove);
    setValue('tags', updatedTags, { shouldDirty: true });
  };

  const handleTogglePin = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    updateNoteMutation.mutate({
      id: note.id,
      input: { isPinned: !note.isPinned },
    });
  };

  const handleCreateNote = () => {
    createNoteMutation.mutate(
      {
        title: t.notes.untitledNote,
        content: '',
        tags: selectedTag ? [selectedTag] : [],
        isPinned: false,
        taskId: '',
      },
      {
        onSuccess: (newNote) => {
          handleSelectNote(newNote.id);
          setEditorMode('edit');
        },
      }
    );
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.notes.confirmDelete)) {
      deleteNoteMutation.mutate(noteId, {
        onSuccess: () => {
          if (activeNoteId === noteId) {
            handleSelectNote(null);
          }
        },
      });
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || note.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const getContextBg = (context?: string) => {
    switch (context) {
      case 'college':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'work':
        return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'business':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'personal':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold tracking-tight">{t.notes.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t.notes.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Notes list (4 cols) */}
        <aside className="lg:col-span-4 space-y-4" aria-label="Daftar Catatan">
          <NotesSidebar
            t={t}
            lang={lang}
            handleCreateNote={handleCreateNote}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allTags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            isLoadingNotes={isLoadingNotes}
            filteredNotes={filteredNotes}
            pinnedNotes={pinnedNotes}
            otherNotes={otherNotes}
            activeNoteId={activeNoteId}
            setActiveNoteId={handleSelectNote}
            handleTogglePin={handleTogglePin}
            handleDeleteNote={handleDeleteNote}
            tasks={tasks}
            getContextBg={getContextBg}
          />
        </aside>

        {/* Right pane: Active Note Editor (8 cols) */}
        <main className="lg:col-span-8" aria-label="Editor Catatan">
          {activeNote ? (
            <NoteEditor
              activeNote={activeNote}
              lang={lang}
              t={t}
              saveStatus={saveStatus}
              editorMode={editorMode}
              setEditorMode={setEditorMode}
              register={register}
              textareaRef={(el) => {
                textareaRef.current = el;
              }}
              insertFormat={insertFormat}
              handleTogglePin={handleTogglePin}
              handleDeleteNote={handleDeleteNote}
              tasks={tasks}
              newTagInput={newTagInput}
              setNewTagInput={setNewTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              tagsValue={tagsValue}
              contentValue={contentValue}
            />
          ) : (
            <EmptyNoteState lang={lang} onCreateNote={handleCreateNote} />
          )}
        </main>
      </div>
    </div>
  );
};

