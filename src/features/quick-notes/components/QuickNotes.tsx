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
import { getContextBg } from '../constants/style';

export const QuickNotes: React.FC = () => {
  const { t, lang } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [allTags, setAllTags] = useState<string[]>([]);

  const { data: notes = [], isLoading: isLoadingNotes } = useGetNotes({
    q: searchQuery || undefined,
    tag: selectedTag || undefined,
  });
  const { data: tasks = [] } = useGetTasks();

  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  useEffect(() => {
    if (notes.length > 0 && !searchQuery && !selectedTag) {
      const tags = Array.from(new Set(notes.flatMap((n) => n.tags)));
      setAllTags(tags);
    }
  }, [notes, searchQuery, selectedTag]);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [newTagInput, setNewTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const dbNote = notes.find((n) => n.id === activeNoteId) || null;

  const activeNote = activeNoteId === 'new' ? {
    id: 'new',
    title: titleValue || '',
    content: contentValue || '',
    tags: tagsValue || [],
    isPinned: false,
    taskId: taskIdValue || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : dbNote;

  useEffect(() => {
    if (activeNoteId === 'new') {
      return;
    }
    if (dbNote) {
      reset({
        title: dbNote.title,
        content: dbNote.content,
        tags: dbNote.tags,
        isPinned: dbNote.isPinned,
        taskId: dbNote.taskId || '',
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
  }, [activeNoteId, dbNote, reset]);

  const handleSave = () => {
    if (!activeNoteId) return;
    setSaveStatus('saving');

    let finalTags = tagsValue;
    const cleanTag = newTagInput.trim();
    if (cleanTag && !tagsValue.includes(cleanTag)) {
      finalTags = [...tagsValue, cleanTag];
      setValue('tags', finalTags, { shouldDirty: true });
      setNewTagInput('');
    }

    if (activeNoteId === 'new') {
      createNoteMutation.mutate(
        {
          title: titleValue || t.notes.untitledNote,
          content: contentValue,
          taskId: taskIdValue,
          tags: finalTags,
          isPinned: false,
        },
        {
          onSuccess: (newNote) => {
            setSaveStatus('saved');
            setActiveNoteId(newNote.id);
            reset(
              {
                title: newNote.title,
                content: newNote.content,
                taskId: newNote.taskId || '',
                tags: newNote.tags,
                isPinned: newNote.isPinned,
              },
              { keepValues: true }
            );
          },
          onError: () => {
            setSaveStatus('error');
          },
        }
      );
    } else {
      updateNoteMutation.mutate(
        {
          id: activeNoteId,
          input: {
            title: titleValue,
            content: contentValue,
            taskId: taskIdValue || undefined,
            tags: finalTags,
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
                tags: finalTags,
              },
              { keepValues: true }
            );
          },
          onError: () => {
            setSaveStatus('error');
          },
        }
      );
    }
  };

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
    if (note.id === 'new') {
      setValue('isPinned', !note.isPinned, { shouldDirty: true });
      return;
    }
    updateNoteMutation.mutate({
      id: note.id,
      input: { isPinned: !note.isPinned },
    });
  };

  const handleCreateNote = () => {
    setActiveNoteId('new');
    setEditorMode('edit');
    reset({
      title: t.notes.untitledNote,
      content: '',
      tags: selectedTag ? [selectedTag] : [],
      isPinned: false,
      taskId: '',
    });
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (noteId === 'new') {
      handleSelectNote(null);
      return;
    }
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

  const filteredNotes = notes;

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold tracking-tight">{t.notes.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t.notes.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Notes list */}
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

        {/* Right pane: Active Note Editor */}
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
              handleSave={handleSave}
              isDirty={isDirty}
            />
          ) : (
            <EmptyNoteState lang={lang} onCreateNote={handleCreateNote} />
          )}
        </main>
      </div>
    </div>
  );
};

