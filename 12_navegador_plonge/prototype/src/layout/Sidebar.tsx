import { NavLink, useLocation } from 'react-router-dom'
import { isNavItemActive, NAV_ITEMS } from './nav'

export function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="hidden h-full w-14 shrink-0 flex-col border-r border-[var(--color-plonge-border)] bg-[var(--color-plonge-card)] md:flex">
      <div className="flex h-14 items-center justify-center border-b border-[var(--color-plonge-border)] px-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-plonge-accent)] text-sm font-semibold text-white"
          title="Plongê Navegador"
        >
          P
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-1.5" aria-label="Módulos">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <div key={to} className="group relative flex justify-center">
            <NavLink
              to={to}
              end={to === '/'}
              aria-label={label}
              aria-current={isNavItemActive(to, pathname) ? 'page' : undefined}
              className={() =>
                [
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-plonge-card)]',
                  isNavItemActive(to, pathname)
                    ? 'bg-[var(--color-plonge-accent-soft)] text-coral-300'
                    : 'text-[var(--color-plonge-muted)] hover:bg-zinc-800/80 hover:text-[var(--color-plonge-ink)]',
                ].join(' ')
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-95" strokeWidth={2} />
            </NavLink>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 z-[60] ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-zinc-600 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-100 opacity-0 shadow-lg ring-1 ring-white/5 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {label}
            </span>
          </div>
        ))}
      </nav>
    </aside>
  )
}
