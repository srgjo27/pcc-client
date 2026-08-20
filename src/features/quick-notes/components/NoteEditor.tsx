import React from 'react';
import {
  Pin,
  Check,
  AlertCircle,
  Trash2,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Edit3,
  Eye,
  Tag,
  Link2,
  X,
  LoaderCircle,
} from 'lucide-react';
import type { Note, NoteInput } from '@/features/quick-notes/types';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Textarea } from '@/shared/components/ui/Textarea';
import { parseMarkdownToHtml } from '@/shared/utils/markdown';
import type { UseFormRegister } from 'react-hook-form';
import { useLanguage } from '@/shared/hooks/useLanguage';

export interface NoteEditorProps {
  activeNote: Note;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  editorMode: 'edit' | 'preview';
  setEditorMode: (mode: 'edit' | 'preview') => void;
  register: UseFormRegister<NoteInput>;
  textareaRef: (el: HTMLTextAreaElement | null) => void;
  insertFormat: (format: 'bold' | 'italic' | 'heading' | 'list' | 'code') => void;
  handleTogglePin: (note: Note, e: React.MouseEvent) => void;
  handleDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  tasks: Array<{ id: string; title: string; context: string }>;
  newTagInput: string;
  setNewTagInput: (val: string) => void;
  handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveTag: (tag: string) => void;
  tagsValue: string[];
  contentValue: string;
  handleSave?: () => void;
  isDirty: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  activeNote,
  saveStatus,
  editorMode,
  setEditorMode,
  register,
  textareaRef,
  insertFormat,
  handleTogglePin,
  handleDeleteNote,
  tasks,
  newTagInput,
  setNewTagInput,
  handleAddTag,
  handleRemoveTag,
  tagsValue,
  contentValue,
  handleSave,
  isDirty,
}) => {
  const { t, lang } = useLanguage();
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="custom"
            size="custom"
            onClick={(e) => handleTogglePin(activeNote, e)}
            className={`p-1.5 rounded-lg border ${activeNote.isPinned
              ? 'bg-amber-50 border-amber-200 text-amber-500'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            title={activeNote.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
          >
            <Pin className={`h-4 w-4 ${!activeNote.isPinned && 'rotate-45'}`} />
          </Button>

          {/* Save indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === 'saving' && (
              <>
                <LoaderCircle />
                <span className="text-slate-400 text-[11px]">{t.notes.saving}</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium text-[11px]">{lang === 'id' ? 'Berhasil diperbarui' : 'Successfully updated'}</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span className="text-rose-600 text-[11px]">Save error!</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeNote.id === 'new' ? (
            <Button
              variant="primary"
              size="sm"
              className="gap-1 font-semibold"
              onClick={handleSave}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{lang === 'id' ? 'Simpan' : 'Save'}</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="gap-1 font-semibold"
              onClick={handleSave}
              disabled={!isDirty}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{lang === 'id' ? 'Perbarui' : 'Update'}</span>
            </Button>
          )}
          <Button
            variant="custom"
            size="sm"
            className="gap-1 text-rose-600 hover:bg-rose-50 border border-rose-200 hover:text-rose-700"
            onClick={(e) => handleDeleteNote(activeNote.id, e)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{activeNote.id === 'new' ? (lang === 'id' ? 'Batal' : 'Cancel') : (lang === 'id' ? 'Hapus' : 'Delete')}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Note Title Input */}
        <Input
          label={lang === 'id' ? 'Judul Catatan' : 'Note Title'}
          placeholder={t.notes.editor.titlePlaceholder}
          {...register('title')}
          aria-label="Judul catatan"
        />

        {/* Dropdown for Task attachment & Tags input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task attachment */}
          <Select
            {...register('taskId')}
            label={t.notes.editor.attachToTask}
            labelIcon={<Link2 className="h-3.5 w-3.5" />}
            options={[
              { value: '', label: `-- ${t.notes.editor.noTaskAttached} --` },
              ...tasks.map((task) => ({
                value: task.id,
                label: `${task.title} (${task.context})`,
              })),
            ]}
          />

          {/* Tags manager */}
          <Input
            label={t.notes.editor.tagsLabel}
            labelIcon={<Tag className="h-3 w-3" />}
            placeholder={t.notes.editor.tagsPlaceholder}
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            aria-labelledby="tag-input-label"
          />
        </div>

        {/* Display active tags */}
        {tagsValue.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tagsValue.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF8E1] text-slate-400 border border-[#FBC02D]"
              >
                <span>{tag}</span>
                <Button
                  variant="custom"
                  size="custom"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-slate-600 rounded-full focus:outline-hidden"
                  aria-label={`Hapus tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ))}
          </div>
        )}

        {/* Editor formatting toolbar & Toggle mode */}
        <div className="border border-neutral-300 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 border-b border-neutral-300 p-2 flex items-center justify-between flex-wrap gap-2">
            {/* formatting tools */}
            <div className="flex items-center gap-1">
              <Button
                variant="custom"
                size="custom"
                onClick={() => insertFormat('bold')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors"
                title={t.notes.editor.bold}
                disabled={editorMode === 'preview'}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="custom"
                size="custom"
                onClick={() => insertFormat('italic')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors"
                title={t.notes.editor.italic}
                disabled={editorMode === 'preview'}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="custom"
                size="custom"
                onClick={() => insertFormat('heading')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors"
                title={t.notes.editor.heading}
                disabled={editorMode === 'preview'}
              >
                <Heading className="h-4 w-4" />
              </Button>
              <Button
                variant="custom"
                size="custom"
                onClick={() => insertFormat('list')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors"
                title={t.notes.editor.list}
                disabled={editorMode === 'preview'}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="custom"
                size="custom"
                onClick={() => insertFormat('code')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors"
                title={t.notes.editor.codeBlock}
                disabled={editorMode === 'preview'}
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            {/* Toggle View mode */}
            <div className="flex bg-slate-200/70 p-0.5 rounded-lg">
              <Button
                variant="custom"
                size="custom"
                onClick={() => setEditorMode('edit')}
                className={`px-3 py-1 rounded-md text-xs font-semibold gap-1 ${editorMode === 'edit'
                  ? 'bg-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Edit3 className="h-3 w-3" />
                <span>{lang === 'id' ? 'Tulis' : 'Write'}</span>
              </Button>
              <Button
                variant="custom"
                size="custom"
                onClick={() => setEditorMode('preview')}
                className={`px-3 py-1 rounded-md text-xs font-semibold gap-1 ${editorMode === 'preview'
                  ? 'bg-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Eye className="h-3 w-3" />
                <span>{lang === 'id' ? 'Pratinjau' : 'Preview'}</span>
              </Button>
            </div>
          </div>

          {/* Input or Preview container */}
          <div className="p-1">
            {editorMode === 'edit' ? (
              <Textarea
                className="min-h-62.5 border-0 font-mono leading-relaxed placeholder-slate-400"
                placeholder={t.notes.editor.contentPlaceholder}
                {...register('content')}
                ref={(e) => {
                  register('content').ref(e);
                  textareaRef(e);
                }}
                aria-label="Isi catatan"
              />
            ) : (
              <div
                className="min-h-62.5 p-4 overflow-y-auto prose max-w-none prose-sm"
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(contentValue) }}
                aria-label="Pratinjau catatan"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};