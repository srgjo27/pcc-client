import React, { useState, useMemo } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Loading } from '@/shared/components/ui/Loading';
import { formatCurrency } from '@/shared/utils/currency';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isTxLoading: boolean;
  onDelete: (id: string) => void;
}

interface TransactionHistoryContentProps {
  isTxLoading: boolean;
  transactionsCount: number;
  filteredTransactions: Transaction[];
  paginatedTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

const TransactionHistoryContent: React.FC<TransactionHistoryContentProps> = ({
  isTxLoading,
  transactionsCount,
  filteredTransactions,
  paginatedTransactions,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}) => {
  const { t, lang } = useLanguage();

  if (isTxLoading) {
    return <Loading />;
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
                  <span>{tx.title}</span>
                  {tx.description && <span className="text-[10px] text-slate-400 mt-0.5">{tx.description}</span>}
                </td>
                <td className="py-3.5 px-2">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full font-medium text-slate-600 text-[10px]">
                    {t.finance.categories[tx.category] || tx.category}
                  </span>
                </td>
                <td className={`py-3.5 px-2 text-right whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="py-3.5 px-2 text-center">
                  <Button
                    variant="custom"
                    size="icon"
                    onClick={() => onDelete(tx.id)}
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-neutral-200 mt-4">
          <div className="text-xs text-slate-500">
            {lang === 'id'
              ? `Menampilkan ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTransactions.length)} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} dari ${filteredTransactions.length} transaksi`
              : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTransactions.length)} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of ${filteredTransactions.length} transactions`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Halaman Sebelumnya"
              className="h-8.5 w-8.5"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Halaman Berikutnya"
              className="h-8.5 w-8.5"
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  isTxLoading,
  onDelete,
}) => {
  const { t, lang } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return sortedTransactions;

    return sortedTransactions.filter((tx) => {
      const titleMatch = tx.title.toLowerCase().includes(query);
      const descMatch = tx.description ? tx.description.toLowerCase().includes(query) : false;
      const categoryLabel = t.finance.categories[tx.category] || tx.category;
      const categoryMatch = categoryLabel.toLowerCase().includes(query);
      return titleMatch || descMatch || categoryMatch;
    });
  }, [sortedTransactions, searchQuery, t.finance.categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const paginatedTransactions = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, activePage]);

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-sm tracking-tight">
          {lang === 'id' ? 'Riwayat Transaksi' : 'Transaction History'}
        </h3>
        <div className="w-full sm:w-64">
          <Input
            placeholder={lang === 'id' ? 'Cari transaksi' : 'Search transactions'}
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Cari Transaksi"
            className="!h-9 !text-xs"
            leftElement={<Search className="h-3 w-3 text-slate-400" />}
          />
        </div>
      </div>

      <TransactionHistoryContent
        isTxLoading={isTxLoading}
        transactionsCount={transactions.length}
        filteredTransactions={filteredTransactions}
        paginatedTransactions={paginatedTransactions}
        currentPage={activePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDelete={onDelete}
      />
    </Card>
  );
};
