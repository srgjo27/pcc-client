import type { DashboardData } from '../types';

/**
 * Mock API service to fetch dashboard data with simulated network latency.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dailyBriefing: {
          date: 'Jumat, 19 Juni 2026',
          greeting: 'Selamat pagi, John Doe!',
          quote: {
            text: 'Fokus bukanlah tentang mengatakan ya pada apa yang Anda kerjakan, tetapi tentang mengatakan tidak pada ratusan ide bagus lainnya.',
            author: 'Steve Jobs',
          },
          focusScore: 85,
          tasksSummary: 'Anda memiliki 4 tugas penting hari ini. Prioritas utama Anda adalah menyelesaikan modul Penjadwalan.',
          insights: [
            'Waktu paling produktif Anda kemarin adalah antara pukul 09:00 - 11:00.',
            'Disarankan mengambil istirahat pendek setiap 50 menit sesi fokus.',
            'Tugas keuangan Anda sudah mendekati batas waktu pembayaran besok.',
          ],
        },
        weeklyReview: {
          productivityScore: 92,
          focusHours: 32.5,
          tasksCompleted: 18,
          reviewSummary: 'Minggu ini performa produktivitas Anda luar biasa, terutama dalam pengerjaan modul Lacak Tugas.',
          chartData: [
            { day: 'Sen', tasksCompleted: 2, focusHours: 4.5 },
            { day: 'Sel', tasksCompleted: 3, focusHours: 5.0 },
            { day: 'Rab', tasksCompleted: 4, focusHours: 6.2 },
            { day: 'Kam', tasksCompleted: 5, focusHours: 7.0 },
            { day: 'Jum', tasksCompleted: 3, focusHours: 5.8 },
            { day: 'Sab', tasksCompleted: 1, focusHours: 2.5 },
            { day: 'Min', tasksCompleted: 0, focusHours: 1.5 },
          ],
          positives: [
            'Menyelesaikan fitur Lacak Tugas lebih cepat 1 hari dari target.',
            'Konsisten melakukan sesi meditasi fokus setiap pagi hari.',
            'Rata-rata jam fokus harian naik 12% dibanding minggu lalu.',
          ],
          improvements: [
            'Kurangi durasi screen-time di malam hari untuk tidur berkualitas.',
            'Distraksi media sosial meningkat di hari Rabu sore.',
          ],
        },
      });
    }, 1500);
  });
}
