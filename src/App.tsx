import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './shared/components/layout/Layout';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#26A69A]" />
      <span className="text-sm text-slate-500">Memuat halaman...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/to-do" element={<TodoPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/habits" element={<HabitsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
