import React from 'react';
import { Loader, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency } from '@/shared/utils/currency';
import { cn } from '@/shared/utils/cn';
import type { Transaction } from '../types';
import type { TranslationType } from '@/constants/strings';

interface TransactionHistoryListProps {
  isTxLoading: boolean;
  transactionsCount: number;
  filteredTransactions: Transaction[];
  paginatedTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  lang: 'id' | 'en';
  t: TranslationType;
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({
  isTxLoading,
  transactionsCount,
  filteredTransactions,
  paginatedTransactions,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onDelete,
  lang,
  t,
}) => {
  if (isTxLoading) {
    return (
      <div className="py-12 flex flex-col justify-center items-center text-slate-400 text-xs">
        <Loader className={cn("animate-spin", "w-6 h-6 text-[#26A69A]")} />
        <span className="mt-2">{lang === 'id' ? 'Memuat data...' : 'Loading data...'}</span>
      </div>
    );
  }

  if (transactionsCount === 0) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400 text-xs">
        <span>{lang === 'id' ? 'Belum ada transaksi' : 'No transactions recorded yet'}</span>
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400 text-xs">
        <span>{lang === 'id' ? 'Tidak ada transaksi yang cocok' : 'No matching transactions found'}</span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2 font-semibold">{lang === 'id' ? 'Tanggal' : 'Date'}</th>
              <th className="py-3 px-2 font-semibold">{lang === 'id' ? 'Transaksi' : 'Title'}</th>
              <th className="py-3 px-2 font-semibold">{lang === 'id' ? 'Kategori' : 'Category'}</th>
              <th className="py-3 px-2 font-semibold text-right">{lang === 'id' ? 'Jumlah' : 'Amount'}</th>
              <th className="py-3 px-2 font-semibold text-center">{lang === 'id' ? 'Aksi' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-2 text-slate-500 font-medium whitespace-nowrap">{tx.date}</td>
                <td className="py-3.5 px-2">
                  <div className="font-bold">{tx.title}</div>
                  {tx.description && <div className="text-[10px] text-slate-400 mt-0.5">{tx.description}</div>}
                </td>
                <td className="py-3.5 px-2">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full font-medium text-slate-600 text-[10px]">
                    {t.finance.categories[tx.category] || tx.category}
                  </span>
                </td>
                <td className={`py-3.5 px-2 text-right font-extrabold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="py-3.5 px-2 text-center">
                  <Button
                    variant="custom"
                    size="icon"
                    onClick={() => onDelete(tx.id)}
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label={`${lang === 'id' ? 'Hapus' : 'Delete'} ${tx.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-neutral-200 mt-4">
          <div className="text-xs text-slate-500">
            {lang === 'id'
              ? `Menampilkan ${Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} - ${Math.min(currentPage * itemsPerPage, filteredTransactions.length)} dari ${filteredTransactions.length} transaksi`
              : `Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} - ${Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of ${filteredTransactions.length} transactions`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 h-8 w-8 rounded-lg flex items-center justify-center"
              aria-label={lang === 'id' ? 'Halaman sebelumnya' : 'Previous page'}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'custom' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 ${currentPage === page ? 'bg-[#26A69A] border-none text-white' : ''}`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 h-8 w-8 rounded-lg flex items-center justify-center"
              aria-label={lang === 'id' ? 'Halaman berikutnya' : 'Next page'}
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
