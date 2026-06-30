import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './shared/components/layout/Layout';
import { Loading } from './shared/components/ui/Loading';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const FocusPage = lazy(() => import('./pages/FocusPage'));
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
  <Loading />
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
                <Route path="/focus" element={<FocusPage />} />
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
