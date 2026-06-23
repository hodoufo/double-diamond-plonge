import { Search } from 'lucide-react'
import { useDetailPanel } from '../context/useDetailPanel'

/** Mesmo ancoramento do compositor (barra módulos + safe area · desktop com sidebar). */
const PLIA_COMPOSER_BAR_LAYOUT =
  'fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 md:bottom-0 md:pb-[env(safe-area-inset-bottom)] md:left-14 pb-0'

export function PliaComposer() {
  const { openDetailPanel } = useDetailPanel()

  return (
    <>
      <div
        className={`pointer-events-none z-30 h-32 bg-gradient-to-t from-[var(--color-plonge-surface)]/90 to-transparent ${PLIA_COMPOSER_BAR_LAYOUT}`}
        aria-hidden
      />
      <div className={`${PLIA_COMPOSER_BAR_LAYOUT} z-40`}>
        <div className="mx-auto flex w-full justify-start px-3 py-2.5 sm:px-5">
          <div className="relative w-full max-w-none md:max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              name="plia-search"
              placeholder="Buscar na Plia…"
              onFocus={() => openDetailPanel({ detail: 'plia:composer' })}
              className="w-full rounded-full border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 shadow-inner placeholder:text-zinc-500 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/25"
              autoComplete="off"
              aria-label="Buscar na Plia"
            />
          </div>
        </div>
      </div>
    </>
  )
}
