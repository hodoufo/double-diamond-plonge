import type { ReactNode } from 'react'
import { useDetailPanel } from '../context/useDetailPanel'

/** Barra módulos (~3.5rem) + barra Plia (~3rem) · desktop só Plia */
const CANVAS_PAD =
  'pb-[calc(3.5rem+3rem+env(safe-area-inset-bottom))] md:pb-[calc(3rem+env(safe-area-inset-bottom))]'

/** Espaço à direita do canvas quando o FloatingDetailPanel está aberto (md+): `right-3` + `w-[min(...,20rem)]` + folga */
const MAIN_PAD_DETAIL_OPEN_MD =
  'md:pr-[calc(0.75rem+0.75rem+min(calc(100vw-1.5rem),20rem))]'

export function PliaSurface({ children }: { children: ReactNode }) {
  const { isOpen } = useDetailPanel()

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className={`min-h-0 flex-1 overflow-y-auto ${CANVAS_PAD}`}
        style={{
          backgroundColor: 'var(--color-plonge-surface)',
          backgroundImage: `radial-gradient(rgba(196, 154, 140, 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-coral-950/25 via-transparent to-transparent" />

        <div
          className={`relative z-10 w-full px-4 py-5 sm:px-5 transition-[padding] duration-200 ease-out motion-reduce:transition-none ${isOpen ? MAIN_PAD_DETAIL_OPEN_MD : 'md:pr-5'}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
