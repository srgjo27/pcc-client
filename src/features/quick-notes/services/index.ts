import type { Note, NoteInput, Task } from '../types';

// Mock list of Tasks to attach to notes
const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Belajar Aljabar Linear', priority: 'high', context: 'college' },
  { id: 'task-2', title: 'Review Pull Request', priority: 'medium', context: 'work' },
  { id: 'task-3', title: 'Persiapan Launching Produk', priority: 'high', context: 'business' },
  { id: 'task-4', title: 'Olahraga Pagi', priority: 'low', context: 'personal' }
];

// Initial mock notes for a nice user experience on first load
const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Catatan Rapat Mingguan',
    content: '# Rapat Desain Sistem\n\n- Gunakan **TailwindCSS** untuk layouting\n- Perhatikan kontras warna dan aksesibilitas `a11y`\n- Gunakan *Vite* untuk bundling yang cepat\n\n```typescript\nconst config = { theme: "dark" };\n```',
    tags: ['Rapat', 'PCC'],
    isPinned: true,
    taskId: 'task-2',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Materi Ujian Aljabar Linear',
    content: '## Bab 3: Matriks & Vektor\n\n- Pelajari invers matriks\n- Latihan soal perkalian matriks *3x3*\n- Tanyakan ke dosen mengenai determinan\n\n*Penting untuk kelulusan!*',
    tags: ['Kuliah', 'Belajar'],
    isPinned: false,
    taskId: 'task-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const LOCAL_STORAGE_KEY = 'pcc_quick_notes';

const getStoredNotes = (): Note[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
    return INITIAL_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTES;
  }
};

const saveStoredNotes = (notes: Note[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
};

// Simulate async network request delay
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const quickNotesService = {
  getNotes: async (): Promise<Note[]> => {
    await delay();
    return getStoredNotes();
  },

  getTasks: async (): Promise<Task[]> => {
    await delay(100);
    return MOCK_TASKS;
  },

  createNote: async (input: NoteInput): Promise<Note> => {
    await delay();
    const notes = getStoredNotes();
    const newNote: Note = {
      ...input,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveStoredNotes(notes);
    return newNote;
  },

  updateNote: async ({ id, input }: { id: string; input: Partial<NoteInput> }): Promise<Note> => {
    await delay();
    const notes = getStoredNotes();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }
    const updatedNote: Note = {
      ...notes[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    saveStoredNotes(notes);
    return updatedNote;
  },

  deleteNote: async (id: string): Promise<boolean> => {
    await delay();
    const notes = getStoredNotes();
    const filtered = notes.filter((n) => n.id !== id);
    saveStoredNotes(filtered);
    return true;
  }
};
