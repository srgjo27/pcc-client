import type { Transaction, Budget, TransactionFormPayload, BudgetFormPayload } from '../types';

const TRANSACTIONS_KEY = 'pcc_finance_transactions';
const BUDGETS_KEY = 'pcc_finance_budgets';

const INITIAL_BUDGETS: Budget[] = [
  { category: 'food', amount: 2000000 },
  { category: 'transportation', amount: 500000 },
  { category: 'subscription', amount: 300000 },
  { category: 'education', amount: 1000000 },
  { category: 'entertainment', amount: 600000 },
  { category: 'others', amount: 500000 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // January 2026
  { id: 't_jan_1', title: 'Gaji Bulanan Januari', type: 'income', amount: 5000000, category: 'salary', date: '2026-01-25', description: 'Gaji bulanan kantor' },
  { id: 't_jan_2', title: 'Proyek Website Freelance', type: 'income', amount: 2000000, category: 'freelance', date: '2026-01-15', description: 'Landing page client' },
  { id: 't_jan_3', title: 'Belanja Bulanan Supermarket', type: 'expense', amount: 1500000, category: 'food', date: '2026-01-05' },
  { id: 't_jan_4', title: 'Bensin & Tol', type: 'expense', amount: 500000, category: 'transportation', date: '2026-01-10' },
  { id: 't_jan_5', title: 'Netflix & Spotify', type: 'expense', amount: 200000, category: 'subscription', date: '2026-01-12' },
  { id: 't_jan_6', title: 'Buku Pemrograman', type: 'expense', amount: 300000, category: 'education', date: '2026-01-18' },
  { id: 't_jan_7', title: 'Nonton Bioskop & Makan Malam', type: 'expense', amount: 400000, category: 'entertainment', date: '2026-01-20' },

  // February 2026
  { id: 't_feb_1', title: 'Gaji Bulanan Februari', type: 'income', amount: 5000000, category: 'salary', date: '2026-02-25' },
  { id: 't_feb_2', title: 'Penjualan Toko Online', type: 'income', amount: 1500000, category: 'business', date: '2026-02-18' },
  { id: 't_feb_3', title: 'Makan Bareng Keluarga', type: 'expense', amount: 1600000, category: 'food', date: '2026-02-08' },
  { id: 't_feb_4', title: 'Service Motor', type: 'expense', amount: 600000, category: 'transportation', date: '2026-02-12' },
  { id: 't_feb_5', title: 'Internet Rumah', type: 'expense', amount: 350000, category: 'subscription', date: '2026-02-05' },
  { id: 't_feb_6', title: 'Konser Musik', type: 'expense', amount: 500000, category: 'entertainment', date: '2026-02-22' },

  // March 2026
  { id: 't_mar_1', title: 'Gaji Bulanan Maret', type: 'income', amount: 5000000, category: 'salary', date: '2026-03-25' },
  { id: 't_mar_2', title: 'Desain Logo Client', type: 'income', amount: 1200000, category: 'freelance', date: '2026-03-10' },
  { id: 't_mar_3', title: 'Beli Bahan Makanan', type: 'expense', amount: 1200000, category: 'food', date: '2026-03-05' },
  { id: 't_mar_4', title: 'Gojek & Grab Bulanan', type: 'expense', amount: 450000, category: 'transportation', date: '2026-03-28' },
  { id: 't_mar_5', title: 'Tagihan Cloud VPS', type: 'expense', amount: 200000, category: 'subscription', date: '2026-03-02' },
  { id: 't_mar_6', title: 'Kursus Online React', type: 'expense', amount: 800000, category: 'education', date: '2026-03-15' },

  // April 2026
  { id: 't_apr_1', title: 'Gaji Bulanan April', type: 'income', amount: 5000000, category: 'salary', date: '2026-04-25' },
  { id: 't_apr_2', title: 'Penjualan Toko Online', type: 'income', amount: 2200000, category: 'business', date: '2026-04-20' },
  { id: 't_apr_3', title: 'Makan di Luar', type: 'expense', amount: 1800000, category: 'food', date: '2026-04-10' },
  { id: 't_apr_4', title: 'Bensin & E-toll', type: 'expense', amount: 550000, category: 'transportation', date: '2026-04-15' },
  { id: 't_apr_5', title: 'Sewa Lapangan Badminton', type: 'expense', amount: 250000, category: 'entertainment', date: '2026-04-22' },

  // May 2026
  { id: 't_may_1', title: 'Gaji Bulanan Mei', type: 'income', amount: 5500000, category: 'salary', date: '2026-05-25' },
  { id: 't_may_2', title: 'Keuntungan Saham', type: 'income', amount: 1800000, category: 'business', date: '2026-05-12' },
  { id: 't_may_3', title: 'Belanja Bulanan & Cafe', type: 'expense', amount: 1900000, category: 'food', date: '2026-05-04' },
  { id: 't_may_4', title: 'Tiket Kereta Api', type: 'expense', amount: 400000, category: 'transportation', date: '2026-05-18' },
  { id: 't_may_5', title: 'Konsultasi Karir', type: 'expense', amount: 500000, category: 'education', date: '2026-05-20' },

  // June 2026 (Current month)
  { id: 't_jun_1', title: 'Gaji Bulanan Juni', type: 'income', amount: 5500000, category: 'salary', date: '2026-06-23' },
  { id: 't_jun_2', title: 'Sampingan Buat Bot Discord', type: 'income', amount: 1200000, category: 'freelance', date: '2026-06-15' },
  { id: 't_jun_3', title: 'Makan Siang & Malam Mingguan', type: 'expense', amount: 1850000, category: 'food', date: '2026-06-10' },
  { id: 't_jun_4', title: 'Service Mobil Tahunan', type: 'expense', amount: 800000, category: 'transportation', date: '2026-06-12' }, // Exceeds budget 500.000!
  { id: 't_jun_5', title: 'Domain & Hosting', type: 'expense', amount: 150000, category: 'subscription', date: '2026-06-02' },
  { id: 't_jun_6', title: 'Gym membership', type: 'expense', amount: 350000, category: 'entertainment', date: '2026-06-05' },
];

function getStoredTransactions(): Transaction[] {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  if (!stored) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

function setStoredTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

function getStoredBudgets(): Budget[] {
  const stored = localStorage.getItem(BUDGETS_KEY);
  if (!stored) {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(INITIAL_BUDGETS));
    return INITIAL_BUDGETS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BUDGETS;
  }
}

function setStoredBudgets(budgets: Budget[]): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredTransactions());
    }, 500);
  });
}

export async function createTransaction(payload: TransactionFormPayload): Promise<Transaction> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = getStoredTransactions();
      const newTransaction: Transaction = {
        ...payload,
        category: payload.category as any,
        id: `t_${Math.random().toString(36).substring(2, 9)}`,
      };
      transactions.push(newEventToTransactions(newTransaction));
      setStoredTransactions(transactions);
      resolve(newTransaction);
    }, 500);
  });
}

function newEventToTransactions(item: any): Transaction {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    amount: Number(item.amount),
    category: item.category as any,
    date: item.date,
    description: item.description || '',
  };
}

export async function deleteTransaction(id: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = getStoredTransactions();
      const filtered = transactions.filter((t) => t.id !== id);
      setStoredTransactions(filtered);
      resolve(id);
    }, 500);
  });
}

export async function fetchBudgets(): Promise<Budget[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredBudgets());
    }, 500);
  });
}

export async function updateBudget(payload: BudgetFormPayload): Promise<Budget> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const budgets = getStoredBudgets();
      const index = budgets.findIndex((b) => b.category === payload.category);
      const updatedBudget: Budget = {
        category: payload.category as any,
        amount: Number(payload.amount),
      };
      if (index > -1) {
        budgets[index] = updatedBudget;
      } else {
        budgets.push(updatedBudget);
      }
      setStoredBudgets(budgets);
      resolve(updatedBudget);
    }, 500);
  });
}
