import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  HiHome,
  HiClipboardDocumentList,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';
import { RoleSwitcher } from '@/components/shared/role-switcher';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/waiter', icon: HiHome, label: 'Dashboard' },
  { path: '/waiter/orders', icon: HiClipboardDocumentList, label: 'Orders' },
];

export default function WaiterShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white flex">
      {/* ── Sidebar (desktop) ──────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-charcoal text-white fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/10">
          <button
            onClick={() => navigate('/waiter')}
            className="text-xl font-bold tracking-tight"
          >
            CHOWLY
          </button>
          <p className="text-xs text-white/50 mt-0.5">Waiter Dashboard</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === '/waiter'
                ? location.pathname === '/waiter'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <RoleSwitcher variant="dark" />
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ─────────────────────── */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-60 bg-charcoal text-white h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 flex items-center justify-between border-b border-white/10">
              <span className="text-xl font-bold tracking-tight">CHOWLY</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/waiter'
                    ? location.pathname === '/waiter'
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 mt-auto">
              <RoleSwitcher variant="dark" />
            </div>
          </motion.aside>
        </motion.div>
      )}

      {/* ── Main area ──────────────────────────────────── */}
      <div className="flex-1 w-full min-w-0 lg:ml-60 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-charcoal"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold tracking-tight text-charcoal">
              CHOWLY
            </span>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full min-w-0 p-4 lg:p-6 pb-20 lg:pb-6 overflow-x-hidden">
          <div className="w-full max-w-7xl mx-auto min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Bottom Navigation (mobile) ─────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              item.path === '/waiter'
                ? location.pathname === '/waiter'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                  isActive
                    ? 'text-charcoal'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

