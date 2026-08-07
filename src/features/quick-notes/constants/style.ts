export const getContextBg = (context?: string): string => {
  const ctx = context?.toLowerCase();
  switch (ctx) {
    case 'college':
    case 'lecture':
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
