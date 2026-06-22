import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/shared/hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { lang, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100/80 hover:bg-slate-200/80 transition-all rounded-full p-1 border border-neutral-300/50">
      <Globe className="h-4 w-4 text-slate-500 ml-1.5 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => changeLanguage('id')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${lang === 'id'
            ? 'bg-white text-emerald-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
            }`}
          aria-label="Ubah bahasa ke Indonesia"
          aria-pressed={lang === 'id'}
        >
          ID
        </button>
        <button
          type="button"
          onClick={() => changeLanguage('en')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${lang === 'en'
            ? 'bg-white text-emerald-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
            }`}
          aria-label="Change language to English"
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
