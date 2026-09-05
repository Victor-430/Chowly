import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  HiHome,
  HiBookOpen,
  HiShoppingCart,
  HiClipboardDocumentList,
} from 'react-icons/hi2';
import { useCartStore } from '@/stores/cart-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { RoleSwitcher } from '@/components/shared/role-switcher';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/customer', icon: HiHome, label: 'Home' },
  { path: '/customer/menu', icon: HiBookOpen, label: 'Menu' },
  { path: '/customer/orders', icon: HiClipboardDocumentList, label: 'Orders' },
  { path: '/customer/cart', icon: HiShoppingCart, label: 'Cart' },
];

export default function CustomerShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant } = useRestaurantStore();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      {/* ── Top Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/customer')}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-bold tracking-tight text-charcoal">
              CHOWLY
            </span>
            <span className="text-xs text-text-secondary hidden sm:inline">
              · {restaurant.name}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="text-xs text-text-secondary hover:text-charcoal transition-colors"
            >
              Switch Role
            </button>
          </div>
        </div>

        {/* Role switcher dropdown */}
        {showRoleSwitcher && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-4 top-full mt-1 z-50"
          >
            <div className="bg-surface rounded-card border border-border shadow-lg p-3">
              <RoleSwitcher />
            </div>
          </motion.div>
        )}
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="flex-1 pb-20">
        <div className="max-w-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ── Bottom Navigation (mobile-first) ───────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              item.path === '/customer'
                ? location.pathname === '/customer'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative',
                  isActive
                    ? 'text-charcoal'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <motion.span
                      key={cartItemCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 bg-amber text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="customer-nav-indicator"
                    className="absolute -bottom-1.5 w-5 h-0.5 rounded-full bg-charcoal"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

