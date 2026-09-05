import { useRoleStore } from '@/stores/role-store'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'

interface RoleSwitcherProps {
  variant?: 'light' | 'dark';
}

export function RoleSwitcher({ variant = 'light' }: RoleSwitcherProps) {
  const { role, switchRole } = useRoleStore()
  const navigate = useNavigate()

  const isDark = variant === 'dark'

  const handleRoleChange = (newRole: 'customer' | 'waiter') => {
    switchRole(newRole)
    if (newRole === 'customer') navigate('/customer')
    if (newRole === 'waiter') navigate('/waiter')
  }

  return (
    <div className={cn(
      "inline-flex items-center rounded-pill p-1",
      isDark ? "border border-white/20" : "border border-border"
    )}>
      <button
        onClick={() => handleRoleChange('customer')}
        className={cn(
          "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
          role === 'customer'
            ? isDark ? "bg-white text-charcoal" : "bg-charcoal text-white"
            : isDark ? "bg-transparent text-white/50 hover:text-white/80" : "bg-transparent text-text-secondary hover:text-charcoal"
        )}
      >
        Customer
      </button>
      <button
        onClick={() => handleRoleChange('waiter')}
        className={cn(
          "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
          role === 'waiter'
            ? isDark ? "bg-white text-charcoal" : "bg-charcoal text-white"
            : isDark ? "bg-transparent text-white/50 hover:text-white/80" : "bg-transparent text-text-secondary hover:text-charcoal"
        )}
      >
        Waiter
      </button>
    </div>
  )
}
