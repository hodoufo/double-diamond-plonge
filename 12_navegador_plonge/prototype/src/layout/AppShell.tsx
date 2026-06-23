import { Outlet } from 'react-router-dom'
import { FloatingDetailPanel } from './FloatingDetailPanel'
import { MobileNav } from './MobileNav'
import { PliaComposer } from './PliaComposer'
import { PliaSurface } from './PliaSurface'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--color-plonge-surface)]">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <PliaSurface>
            <Outlet />
          </PliaSurface>
          <FloatingDetailPanel />
        </div>
      </div>
      <MobileNav />
      <PliaComposer />
    </div>
  )
}
