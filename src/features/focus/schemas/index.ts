import { z } from 'zod';

export const focusSettingsSchema = z.object({
  focusDuration: z
    .number({ message: 'Durasi fokus harus berupa angka' })
    .int()
    .min(1, 'Durasi fokus minimal 1 menit')
    .max(180, 'Durasi fokus maksimal 180 menit'),
  breakDuration: z
    .number({ message: 'Durasi istirahat harus berupa angka' })
    .int()
    .min(1, 'Durasi istirahat minimal 1 menit')
    .max(60, 'Durasi istirahat maksimal 60 menit'),
});

export const focusTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Nama tugas minimal 2 karakter')
    .max(100, 'Nama tugas maksimal 100 karakter'),
});
