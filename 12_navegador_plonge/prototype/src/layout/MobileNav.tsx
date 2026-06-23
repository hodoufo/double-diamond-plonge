import { NavLink, useLocation } from 'react-router-dom'
import { isNavItemActive, NAV_ITEMS } from './nav'

export function MobileNav() {
  const { pathname } = useLocation()
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)]/95 px-1 py-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Módulos"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          aria-current={isNavItemActive(to, pathname) ? 'page' : undefined}
          className={() =>
            [
              'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px]',
              isNavItemActive(to, pathname)
                ? 'font-medium text-coral-400'
                : 'text-zinc-500',
            ].join(' ')
          }
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
