import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Wallet,
  NotebookPen,
  FishingRod,
  BrainCog,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ASSETS } from '@/constants/assets';
import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: t.menu.dashboard,
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t.menu.todo,
      path: '/to-do',
      icon: ClipboardList,
    },
    {
      name: t.menu.schedule,
      path: '/schedule',
      icon: Calendar,
    },
    {
      name: t.menu.finance,
      path: '/finance',
      icon: Wallet,
    },
    {
      name: t.menu.notes,
      path: '/notes',
      icon: NotebookPen,
    },
    {
      name: t.menu.habits,
      path: '/habits',
      icon: FishingRod,
    },
    {
      name: t.menu.focus,
      path: '#',
      icon: BrainCog,
      disabled: true,
    },
  ];

  // Helper to determine page title based on route
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return t.menu.dashboard;
    if (location.pathname === '/to-do') return t.menu.todo;
    if (location.pathname === '/schedule') return t.menu.schedule;
    if (location.pathname === '/finance') return t.menu.finance;
    if (location.pathname === '/notes') return t.menu.notes;
    if (location.pathname === '/habits') return t.menu.habits;
    return t.appName;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50 font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-neutral-300 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Brand Header */}
        <div className={cn("flex h-16 items-center border-b border-neutral-300 px-4", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <img src={ASSETS.images.pcc} alt="PCC Logo" loading="lazy" className="w-auto object-contain" />
                </div>
                <span className="text-base font-bold bg-linear-to-r from-[#26A69A] via-[#29B6F6] to-[#FFB300] bg-clip-text text-transparent truncate">
                  {t.appName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-[#F0F9FF] hover:text-[#26A69A] transition-colors"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-[#F0F9FF] hover:text-[#26A69A] transition-colors"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Sidebar Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 cursor-not-allowed select-none',
                    isCollapsed && 'justify-center'
                  )}
                  title={`${item.name} (${t.menu.comingSoon})`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#F0F9FF] text-[#26A69A] font-semibold'
                      : 'hover:bg-slate-100 hover:text-slate-600',
                    isCollapsed && 'justify-center'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-300 p-3">
          {/* Footer is empty for now */}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-300 transition-transform duration-300 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center px-4 border-b border-neutral-300 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <img src={ASSETS.images.pcc} alt="PCC Logo" loading="lazy" className="w-auto object-contain" />
            </div>
            <span className="text-base font-bold bg-linear-to-r from-[#26A69A] via-[#29B6F6] to-[#FFB300] bg-clip-text text-transparent truncate">
              {t.appName}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 hover:bg-[#F0F9FF] hover:text-[#26A69A] transition-colors"
            aria-label="Tutup Menu"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Mobile Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed select-none"
                  title={`${item.name} (${t.menu.comingSoon})`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#F0F9FF] text-[#26A69A] font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-300 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-[#F0F9FF] hover:text-[#26A69A] transition-colors md:hidden"
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* View/Page Title */}
            <h2 className="font-semibold text-slate-800">
              {getPageTitle()}
            </h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Page Wrapper & Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 focus:outline-none">
          {children || <Outlet />}
        </main>

        {/* Sticky Footer */}
        <footer className="border-t border-neutral-300 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <div>
              &copy; {`2026`} {`${t.appName}. ${t.rightsReserved}`}
            </div>
            <div>
              <span>{`${t.version} ${t.systemVersion}`}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Layout;
