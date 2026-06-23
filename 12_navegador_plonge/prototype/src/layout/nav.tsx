import type { ComponentType } from 'react'
import {
  BookOpen,
  Building2,
  Kanban,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react'

/** Props aceites pelos ícones Lucide na barra — o marcador Home usa só classe + strokeWidth ignorado. */
export type NavIconProps = {
  className?: string
  strokeWidth?: number
}

/** Ícone «P» da Plongê para o atalho Home (mesma leitura visual do logo na sidebar). */
export function NavHomeMark({ className, strokeWidth: _stroke }: NavIconProps) {
  return (
    <span
      className={[
        'flex shrink-0 items-center justify-center rounded-md font-semibold leading-none tracking-tight',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      P
    </span>
  )
}

export type NavItem = {
  to: string
  label: string
  icon: ComponentType<NavIconProps>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: NavHomeMark },
  { to: '/contacts', label: 'Contatos', icon: Users },
  { to: '/conversations', label: 'Conversas', icon: MessageSquare },
  { to: '/companies', label: 'Empresas', icon: Building2 },
  { to: '/deals', label: 'Negócios', icon: TrendingUp },
  { to: '/projects', label: 'Projetos', icon: Kanban },
  { to: '/kb', label: 'Conhecimento', icon: BookOpen },
]

/** Destaque do item na barra — inclui detalhe `/contact/:id` no módulo Contatos. */
export function isNavItemActive(to: string, pathname: string): boolean {
  const path = pathname || '/'
  if (to === '/') {
    return path === '/' || path.startsWith('/home')
  }
  if (to === '/contacts') {
    return (
      path === '/contacts' ||
      path.startsWith('/contacts/') ||
      /^\/contact\/[^/]+$/u.test(path)
    )
  }
  if (path === to) return true
  if (to !== '/' && path.startsWith(`${to}/`)) return true
  return false
}

/**
 * Título do módulo ativo, alinhado a `NAV_ITEMS` (rotas aninhadas usam o prefixo mais longo).
 */
export function getModuleLabel(pathname: string): string {
  const path = pathname || '/'
  if (path.startsWith('/contact/')) {
    return NAV_ITEMS.find((i) => i.to === '/contacts')?.label ?? 'Contatos'
  }
  const sorted = [...NAV_ITEMS].sort((a, b) => b.to.length - a.to.length)
  for (const item of sorted) {
    if (path === item.to) return item.label
    if (item.to !== '/' && path.startsWith(`${item.to}/`)) return item.label
  }
  return NAV_ITEMS[0].label
}
